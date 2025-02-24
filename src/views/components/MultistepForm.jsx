import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Cookies from 'js-cookie';
import CommonContext from '../../hooks/CommonContext';
import CustomButton from '../../reusable-components/CustomButton';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import CustomSpinner from '../../reusable-components/CustomSpinner';


const MultistepForm = () => {
    const {
        fetchedPdfBlobFile,
        setFetchedPdfBlobFile
    } = useContext(CommonContext)

    const [pdfUrl, setPdfUrl] = useState("");
    const [newPdfUrl, setNewPdfUrl] = useState("");

    const [loading, setLoading] = useState(false)
    const [loadingAction, setLoadingAction] = useState(null);
    const [generateNewPdfEnabled, setGenerateNewPdfEnabled] = useState(false)
    const [pageLoadingModal, setPageLoadingModal] = useState(false)
    const [step, setStep] = useState(1);
    const [dialCode, setDialCode] = useState("")
    const [countryCode, setCountryCode] = useState(null)
    const [mobileNumber, setMobileNumber] = useState({
        mobileNumber: "",
        countryCode: ""
    })
    const [step2Enabled, setStep2Enabled] = useState(false)
    const [step3Enabled, setStep3Enabled] = useState(false)
    const [isPdfLoaded, setIsPdfLoaded] = useState(true)


    useEffect(() => {
        (async () => handleFetchPdf())()
    }, [isPdfLoaded])

    const handleFetchPdf = async () => {
        try {
            setPageLoadingModal(true);

            const payload = {
                request_id: Cookies.get("digiLockerAccessId"),
                filename: "SBI.pdf"
            };
            const response = await axiosInstance.post("/filled_form", payload, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`
                }
            });

            if (response.data.error_code === 200) {
                setPageLoadingModal(false);
                setStep2Enabled(true)
                const base64ToBlobUrl = (pdfBlob1) => {
                    const base64WithoutPrefix = pdfBlob1.split(",")[1];
                    const byteCharacters = atob(base64WithoutPrefix);
                    const byteNumbers = new Uint8Array([...byteCharacters].map((char) => char.charCodeAt(0)));
                    const blob = new Blob([byteNumbers], { type: "application/pdf" });
                    return URL.createObjectURL(blob);
                };

                const pdfBlobUrl = base64ToBlobUrl(response.data.data.file_blob);
                setFetchedPdfBlobFile(response.data.data.file_blob.split(",")[1])
                setPdfUrl(pdfBlobUrl);

            }
            else if (response.data.error_code === 400) {
                setTimeout(() => {
                    console.log("⏳ Retrying API call 400...");
                    setIsPdfLoaded(!isPdfLoaded)
                }, 5000);
            }
            else {
                setPageLoadingModal(false);
                toast.error(response.data.message);
            }
        } catch (error) {
            setPageLoadingModal(false);
            console.log(error);
        }
    };


    const handlePhoneInput = (e, phone, mobileNumber) => {
        setMobileNumber((prevState) => ({
            ...prevState,
            mobileNumber: e.slice(phone.dialCode.length),
            countryCode: phone.dialCode,
        }));
        setCountryCode(phone.dialCode)
        setDialCode(phone.dialCode)

    };


    const handleCallNow = async () => {

        if (mobileNumber.mobileNumber === "") {
            toast.warn("Please enter your mobile number")
            return
        }

        if (window.confirm(`Are you sure you want to call +${mobileNumber.countryCode}${mobileNumber.mobileNumber}?`)) {
            // window.location.href = `tel:+${mobileNumber.countryCode}${mobileNumber.mobileNumber}`;
            try {



                setLoading(true)
                setLoadingAction("CallNow")
                const payload = {
                    "file_blob": fetchedPdfBlobFile,
                    "phone_number": `+${countryCode}${mobileNumber.mobileNumber}`
                }
                console.log("payload", payload)


                const response = await axiosInstance.post("/initiate_outbound_call", payload)
                console.log(response.data)
                if (response.data.error_code === 200) {
                    setLoading(false)
                    console.log("response.data.error_code === 200")
                    toast.success(response.data.message)
                    setGenerateNewPdfEnabled(true)
                } else {
                    setLoading(false)

                    console.log("else part")
                    toast.error(response.data.error_code)
                }

            } catch (error) {
                setLoading(false)

                toast.error(response.data.error_code)
                console.log(error)
            }
        }
    }

    const handleFinish = () => {
        toast.success("Finished")
    }

    const handleGenerateNewPDF = async () => {
        try {
            setLoading(true)
            setLoadingAction("GenerateNewPDF")

            const payload = {
                "file_blob": fetchedPdfBlobFile,
                "phone_number": `+${countryCode}${mobileNumber.mobileNumber}`
            }
            console.log("payload", payload)


            const response = await axiosInstance.post("/get_filled_form", payload)
            console.log(response.data)
            if (response.data.error_code === 200) {
                setLoading(false)

                console.log("200 response.data.message", response.data.message);
                setStep(1)
                setStep3Enabled(true)
                // ✅ Convert Base64 to Blob URL
                const base64ToBlobUrl = (pdfBlob1) => {
                    const base64WithoutPrefix = pdfBlob1.split(",")[1];
                    const byteCharacters = atob(base64WithoutPrefix);
                    const byteNumbers = new Uint8Array([...byteCharacters].map((char) => char.charCodeAt(0)));
                    const blob = new Blob([byteNumbers], { type: "application/pdf" });
                    return URL.createObjectURL(blob);
                };

                // ✅ Convert and Set PDF URL
                const newPdfBlobUrl = base64ToBlobUrl(response.data.data.file_blob);
                setFetchedPdfBlobFile(response.data.data.file_blob.split(",")[1])
                setNewPdfUrl(newPdfBlobUrl);
                toast.success(response.data.message)
            } else {
                setLoading(false)
                toast.error(response.data.error_code)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <Container className='main-section' fluid>
            <Container className='p-5 h-100'>
                <Row className='card h-100 rounded-5 border-0 flex-column'>
                    <div className="progress-container  mt-5 px-5 w-75 mx-auto">
                        <div className="progress-step">
                            <div className={`circle ${step >= 1 ? "active" : ""} cup`} onClick={() => setStep(1)}>1</div>
                            <div className={`line ${step >= 2 ? "filled " : ""} `}></div>
                            <div className={`circle ${step >= 2 ? "active " : ""} cup ${step2Enabled ? "" : "pe-none opacity-25"}`} onClick={() => setStep(2)}>2</div>
                            <div className={`line ${step >= 3 ? "filled" : ""}`}></div>
                            <div className={`circle ${step >= 3 ? "active" : ""} cup ${step3Enabled ? "" : "pe-none opacity-25"}`} onClick={() => setStep(3)}>3</div>
                        </div>
                    </div>
                    {
                        step === 1 &&
                        <Col className="overflow-scroll w-100 col d-flex justify-content-center">
                            {newPdfUrl ?
                                <iframe
                                    src={newPdfUrl}
                                    title="Filled PDF"
                                    style={{ width: "60%", height: "100%", border: "none" }}
                                />
                                :
                                pdfUrl ?
                                    <iframe
                                        src={pdfUrl}
                                        title="Filled PDF"
                                        style={{ width: "60%", height: "100%", border: "none" }}
                                    />
                                    :
                                    <div className='d-flex justify-content-center align-items-center '>
                                        <h5>Loading PDF...</h5>
                                    </div>
                            }
                        </Col>
                    }
                    {
                        step === 2 &&
                        <Col className="overflow-scroll w-100 col  ">
                            <div className='px-5 my-5  mx-auto d-block '>
                                <div>
                                    <p htmlFor="field1" className="form-label mb-3 text-grey">There are a few additional questions that need to be answered to complete your application.<br /> Please enter your phone number so we can call you to get that information.</p>
                                    <div>
                                        <div className="container-fluid mt-4 mx-auto">
                                            <div className="row mb-2">
                                                <div className="mb-4  w-lg-25  mt-3">
                                                    <PhoneInput
                                                        id="floatingInput"
                                                        specialLabel="Mobile Number"
                                                        country={dialCode === "" ? "in" : dialCode}
                                                        dataTestid="mobileNumber"
                                                        countryCodeEditable={false}
                                                        enableSearch
                                                        onChange={(e, phone) =>
                                                            handlePhoneInput(e, phone, "mobileNumber")
                                                        }
                                                        value={`${countryCode}${mobileNumber.mobileNumber}`}
                                                        inputProps={{
                                                            alt: "mobileNumber",
                                                            type: "tel",
                                                            placeholder: "Mobile Number",
                                                            required: true,
                                                            style: { borderColor: "grey", backgroundColor: "white" },  // Inline style to override red border
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomButton
                                                        buttonName={loading && loadingAction === "CallNow" ? <CustomSpinner variant="light" size="sm" /> : "Call now"}
                                                        className={`btn btn-success d-block cup call-now-button  ${loading && 'pe-none opacity-50'}`}
                                                        onClick={handleCallNow}
                                                    />
                                                    <CustomButton
                                                        buttonName={loading && loadingAction === "GenerateNewPDF" ? <CustomSpinner variant="light" size="sm" /> : "Generate new PDF"}
                                                        className={`btn mt-4 cup generate-new-pdf-button  py-2 ${loading || !generateNewPdfEnabled && 'pe-none opacity-50'}`}
                                                        onClick={handleGenerateNewPDF}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    }
                    {
                        step === 3 &&
                        <div className={`step step-3 px-5`}>
                            <p htmlFor="field1" className="form-label text-grey mt-5">Please click on preview to review and download the form. Thank you for using Digiform!</p>
                            <div className=''>
                                <button type="button" className="btn btn-success " onClick={() => handleFinish()}>Finish</button>
                            </div>
                        </div>
                    }
                </Row>
            </Container>
            {pageLoadingModal && (
                <div
                    className="modal show"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Black backdrop
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1050,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: "100%" }}
                    >
                        <div className="d-flex justify-content-center text-light gap-3 align-items-center">
                            <div className="spinner-border spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <h5 className='fw-bold'>Loading...</h5>
                        </div>
                    </div>
                </div>
            )}
        </Container >
    )
}

export default MultistepForm
