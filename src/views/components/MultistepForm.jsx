import React, { useContext, useEffect, useRef, useState } from 'react'
import { Form, Col, Container, Row } from 'react-bootstrap'
import CommonContext from '../../hooks/CommonContext';
import CustomButton from '../../reusable-components/CustomButton';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import CustomSpinner from '../../reusable-components/CustomSpinner';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-dropdown-select'
import axios from 'axios';
import CustomModal from '../../reusable-components/CustomModal';




const MultistepForm = () => {

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const navigate = useNavigate()

    const {
        fetchedPdfBlobFile,
        setFetchedPdfBlobFile,
    } = useContext(CommonContext)

    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [pdfUrl, setPdfUrl] = useState("");
    const [newPdfUrl, setNewPdfUrl] = useState("");
    const [generateCallModal, setGenerateCallModal] = useState(false);


    const [loading, setLoading] = useState(false)
    const [loadingAction, setLoadingAction] = useState(null);
    const [generateNewPdfEnabled, setGenerateNewPdfEnabled] = useState(false)
    const [formFields, setFormFields] = useState({})
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


    const [searchTerm, setSearchTerm] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();

    // Fetch pincode when input is 6 digits
    // useEffect(() => {
    //     if (/^\d{5}$/.test(searchTerm)) {
    //         setSearchLoading(true);
    //         setOptions([]);
    //         setShowDropdown(true);
    //     }

    //     if (/^\d{6}$/.test(searchTerm)) {
    //         setTimeout(() => {
    //             getPostOffices(searchTerm);
    //         }, 10);
    //     }

    //     if (searchTerm.length < 5 || searchTerm.length > 6) {
    //         setSearchLoading(false);
    //         setOptions([]);
    //     }
    // }, [searchTerm]);

    // const getPostOffices = async (pincode) => {
    //     try {
    //         const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    //         const postOffices = response.data[0]?.PostOffice || [];
    //         const formatted = postOffices.map((item, index) => ({
    //             id: index + 1,
    //             name: item.Name,
    //             pincode: item.Pincode,
    //         }));
    //         setOptions(formatted);
    //         setShowDropdown(true);
    //     } catch (err) {
    //         console.error("Error fetching:", err);
    //         setOptions([]);
    //     } finally {
    //         setSearchLoading(false);
    //     }
    // };

    const handleSelect = (item) => {
        setSelected(item);
        // setSearchTerm("");
        setOptions([]);
        setShowDropdown(false);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



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
                setFormFields(response.data.data.form_fields)
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

    const handleCall = async () => {
        try {
            setLoading(true)
            setLoadingAction("Call")
            const payload = {
                "file_blob": fetchedPdfBlobFile,
                "phone_number": `+${countryCode}${mobileNumber.mobileNumber}`,
                "language": language,
            }
            const response = await axiosInstance.post("/initiate_outbound_call", payload)

            if (response.data.error_code === 200) {
                sessionStorage.setItem("conversationId", response.data.data.conversation_id)
                sessionStorage.setItem("serviceId", response.data.data.service_id)
                setLoading(false)
                setGenerateCallModal(false)
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

    const handleFinish = () => {
        navigate("/home");
    }

    const handleGenerateNewPDF = async () => {
        try {
            setLoading(true)
            setLoadingAction("GenerateNewPDF")

            const payload = {
                "file_blob": fetchedPdfBlobFile,
                "conversation_id": sessionStorage.getItem("conversationId"),
                "service_id": sessionStorage.getItem("serviceId"),
                "filename": sessionStorage.getItem("selectedPdf"),
                "form_fields": formFields
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

    const modalBodyFun = () => {
        return (
            <>
                <h3 className='my-3 mb-4 text-center ' style={{ color: '#5b719b' }}>Call Request</h3>

                <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: '16px' }}>
                    {`Would you like to proceed with calling +${mobileNumber.countryCode}${mobileNumber.mobileNumber}?`}
                </p>

                <div className="mx-2 my-3 mt-4 d-flex gap-3">
                    <CustomButton
                        buttonName="Cancel"
                        className='px-3 mt-2 w-50 btn btn-secondary'
                        onClick={() => setGenerateCallModal(false)}
                    />
                    <CustomButton
                        buttonName={loading && loadingAction === "Call" ? <CustomSpinner variant="light" size="sm" /> : "Call"}
                        className='px-3 mt-2 w-50 btn logout-button'
                        onClick={() => handleCall()}
                    />
                </div>
            </>
        )
    }

    return (
        <Container className='main-section' fluid>
            <Container className='p-3 p-md-5 h-100'>
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
                        <Col className="overflow-scroll w-100 col d-flex justify-content-center ">
                            {newPdfUrl ?
                                isMobileScreen ?
                                    <div style={{ height: '600px', width: '100%' }}>
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                            <Toolbar />
                                            <Viewer fileUrl={newPdfUrl} plugins={[toolbarPluginInstance]} />
                                        </Worker>
                                    </div>
                                    :
                                    <iframe
                                        src={newPdfUrl}
                                        title="Filled PDF"
                                        style={{ width: "60%", height: "100%", border: "none" }}
                                    />
                                :
                                pdfUrl ?
                                    isMobileScreen ?
                                        <div style={{ height: '100%', width: '100%' }}>
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                                <Toolbar />
                                                <Viewer fileUrl={pdfUrl} plugins={[toolbarPluginInstance]} />
                                            </Worker>
                                        </div>
                                        :
                                        <iframe
                                            src={pdfUrl}
                                            title="Filled PDF"
                                            style={{ width: "60%", height: "100vh", border: "none" }}
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
                                    <div className="container-fluid mt-4 mx-auto ">
                                        <div className="row mb-4 align-items-center">
                                            <div className="mt-3 mt-lg-0 col-sm-12 col-lg-4">
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
                                            <div className='mt-4 mt-lg-0 col-sm-12 col-lg-4'>
                                                <Form.Select aria-label="select language" value={language} onChange={(e) => setLanguage(e.target.value)} size='lg' className='p-2 py-3 fs-6 border-1'>
                                                    <option className='fs-6'>Select Language</option>
                                                    {/* <option className='fs-6' value="English">English</option> */}
                                                    <option className='fs-6' value="Hindi">Hindi</option>
                                                </Form.Select>
                                            </div>
                                            {/* <div className="mt-4 mt-lg-0 col-sm-12 col-lg-4 position-relative" style={{ maxWidth: "400px" }} ref={dropdownRef}>
                                                <input
                                                    type="text"
                                                    className="form-control p-3"
                                                    placeholder="Enter 6-digit pincode"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onFocus={() => {
                                                        if (options.length > 0) setShowDropdown(true);
                                                    }}
                                                />

                                                {showDropdown && (
                                                    <div
                                                        className="border rounded mt-1 position-absolute bg-white w-100 shadow"
                                                        style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                                                    >
                                                        {searchLoading && (
                                                            <div className="p-2 text-center">
                                                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                                <span className="ms-2">Searching...</span>
                                                            </div>
                                                        )}

                                                        {!searchLoading && options.length > 0 && options.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="p-2 dropdown-item"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleSelect(item)}
                                                            >
                                                                {item.name} ({item.pincode})
                                                            </div>
                                                        ))}

                                                        {!searchLoading && options.length === 0 && (
                                                            <div className="p-2 text-danger">No results found</div>
                                                        )}
                                                    </div>
                                                )}
                                                {selected && (
                                                    <div className="mt-3">
                                                        Selected: <strong>{selected.name} ({selected.pincode})</strong>
                                                    </div>
                                                )}
                                            </div> */}
                                        </div>

                                        <div>
                                            <CustomButton
                                                buttonName="Call now"
                                                className={`btn btn-success d-block cup call-now-button col-sm-12 col-md-4 col-lg-3 
                                                                    ${!mobileNumber.mobileNumber || language === "Select Language" ? 'pe-none opacity-50' : ''}`
                                                }
                                                onClick={() => setGenerateCallModal(true)}
                                            />
                                            <CustomButton
                                                buttonName={loading && loadingAction === "GenerateNewPDF" ? <CustomSpinner variant="light" size="sm" /> : "Generate new PDF"}
                                                className={`btn mt-4 cup generate-new-pdf-button  py-2 col-sm-12 col-md-4 col-lg-3 ${loading || !generateNewPdfEnabled && 'pe-none opacity-50'}`}
                                                onClick={handleGenerateNewPDF}
                                            />
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
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
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

            <CustomModal
                show={generateCallModal}
                modalBody={modalBodyFun()}
                onHide={() => setGenerateCallModal(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            />

        </Container >
    )
}

export default MultistepForm
