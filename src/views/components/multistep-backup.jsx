import React, { useContext, useEffect, useState } from 'react'
import { Form, Col, Container, Row } from 'react-bootstrap'
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
        setFetchedPdfBlobFile,
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
    const [language, setLanguage] = useState("Select Language")


    useEffect(() => {
        (async () => handleFetchPdf())()
    }, [isPdfLoaded])

    const handleFetchPdf = async () => {
        try {
            setPageLoadingModal(true);

            const payload = {
                request_id: sessionStorage.getItem("digiLockerAccessId"),
                filename: sessionStorage.getItem("selectedPdf")
            };
            const response = await axiosInstance.post("/filled_form", payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
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
            try {
                setLoading(true)
                setLoadingAction("CallNow")
                const payload = {
                    "file_blob": fetchedPdfBlobFile,
                    "phone_number": `+${countryCode}${mobileNumber.mobileNumber}`,
                    "language": language

                }
                const response = await axiosInstance.post("/initiate_outbound_call", payload)

                if (response.data.error_code === 200) {
                    sessionStorage.setItem("conversationId", response.data.data.conversation_id)
                    sessionStorage.setItem("serviceId", response.data.data.service_id)
                    setLoading(false)
                    toast.success(response.data.message)
                    setGenerateNewPdfEnabled(true)
                } else {
                    setLoading(false)
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
                "conversation_id": sessionStorage.getItem("conversationId"),
                "service_id": sessionStorage.getItem("serviceId")
            }

            const response = await axiosInstance.post("/get_filled_form", payload)
            if (response.data.error_code === 200) {
                setLoading(false)
                setStep(1)
                setStep3Enabled(true)
                const base64ToBlobUrl = (pdfBlob1) => {
                    const base64WithoutPrefix = pdfBlob1.split(",")[1];
                    const byteCharacters = atob(base64WithoutPrefix);
                    const byteNumbers = new Uint8Array([...byteCharacters].map((char) => char.charCodeAt(0)));
                    const blob = new Blob([byteNumbers], { type: "application/pdf" });
                    return URL.createObjectURL(blob);
                };

                const newPdfBlobUrl = base64ToBlobUrl(response.data.data.file_blob);
                setFetchedPdfBlobFile(response.data.data.file_blob.split(",")[1])
                setNewPdfUrl(newPdfBlobUrl);
                toast.success(response.data.message)
            } else if (response.data.error_code === 1) {
                toast.info(response.data.message)
                setLoading(false)
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
                    <div className="progress-container mt-5 px-5 mx-auto col-sm-12 col-lg-9">
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
                                    null
                            }
                        </Col>
                    }
                    {
                        step === 2 &&
                        <Col className="overflow-scroll w-100 col  ">
                            <div className='px-lg-5 px-3 my-5 mx-auto d-block '>
                                <div>
                                    <p htmlFor="field1" className="form-label mb-3 text-grey">There are a few additional questions that need to be answered to complete your application.<br /> Please enter your phone number so we can call you to get that information.</p>
                                    <p htmlFor="field1" className="form-label mb-3 text-grey fst-italic">(Once the call is complete, please regenerate the PDF to include the updated details)</p>
                                    <div>
                                        <div className="container-fluid mt-4 mx-auto">
                                            <div className="row mb-2">
                                                <div className="mb-4 mt-3 col-sm-12 col-lg-5">
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
                                                            style: { borderColor: "grey", backgroundColor: "white" },
                                                        }}
                                                    />

                                                </div>
                                                <div className='mt-sm-0 mb-4 col-sm-12 col-lg-5 mt-lg-3'>
                                                    <Form.Select aria-label="select language" value={language} onChange={(e) => setLanguage(e.target.value)} size='lg' className='p-2 py-3 fs-6'>
                                                        <option className='fs-6'>Select Language</option>
                                                        <option className='fs-6' value="English">English</option>
                                                        <option className='fs-6' value="Hindi">Hindi</option>
                                                    </Form.Select>
                                                </div>

                                                <div>
                                                    <CustomButton
                                                        buttonName={loading && loadingAction === "CallNow" ? <CustomSpinner variant="light" size="sm" /> : "Call now"}
                                                        className={`btn btn-success d-block cup call-now-button col-sm-12 col-md-3 col-lg-2 
                                                                    ${loading || !mobileNumber.mobileNumber  || language === "Select Language"  ? 'pe-none opacity-50' : ''}`
                                                        }
                                                        onClick={handleCallNow}
                                                    />
                                                    <CustomButton
                                                        buttonName={loading && loadingAction === "GenerateNewPDF" ? <CustomSpinner variant="light" size="sm" /> : "Generate new PDF"}
                                                        className={`btn mt-4 cup generate-new-pdf-button  py-2 col-sm-12 col-md-3 col-lg-2  ${loading || !generateNewPdfEnabled && 'pe-none opacity-50'}`}
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
                            <p htmlFor="field1" className="form-label text-grey mt-5">Thank you for using Digiform!</p>
                            <div className='mt-4'>
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
