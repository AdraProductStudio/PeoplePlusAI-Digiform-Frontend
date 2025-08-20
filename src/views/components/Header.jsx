import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images'
import { useNavigate } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import { BsInfoSquareFill } from "react-icons/bs";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CustomModal from '../../reusable-components/CustomModal';





const Header = ({ currentPage }) => {
    const navigate = useNavigate()
    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);
    const [modalShow, setModalShow] = useState(false);
    const [logoutModalShow, setLogoutModalShow] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const isFirstVisit = sessionStorage.getItem("isDigiFormFirstVisit");
        if (!isFirstVisit) {
            if (window.location.pathname === "/home") {
                setModalShow(true)
                sessionStorage.setItem("isDigiFormFirstVisit", "true");
            }
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")
        sessionStorage.removeItem("digiLockerURL")
        sessionStorage.removeItem("digiLockerAccessId")
        sessionStorage.removeItem("conversationId")
        sessionStorage.removeItem("serviceId")
        sessionStorage.removeItem("selectedPdf")
        sessionStorage.removeItem("isDigiFormFirstVisit")
        navigate("/");
    }

    const handleLogoClick = () => {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")
        sessionStorage.removeItem("digiLockerURL")
        sessionStorage.removeItem("digiLockerAccessId")
        sessionStorage.removeItem("conversationId")
        sessionStorage.removeItem("serviceId")
        sessionStorage.removeItem("selectedPdf")
        sessionStorage.removeItem("isDigiFormFirstVisit")
        navigate("/");
    }

    const modalBodyFun = () => {
        return (
            <>
                <h3 className='my-3 mb-4 text-center ' style={{ color: '#5b719b' }}>Digiform – Forms Made Easy. Just Talk, We Fill!</h3>

                <p className='px-2' style={{ fontWeight: '450', fontSize: '16px' }}>
                    DigiForm is an AI-powered automated form-filling solution that securely retrieves user data via DigiLocker and completes missing details through an interactive voice agent.
                </p>

                <div className='px-2 px-md-5' style={{ color: '#666', fontSize: '15px' }}>
                    Step 1: Sign up and Form selection
                    Sign-up and log-in into the Application
                    On the home screen, select the desired bank form (SBI, ICICI, or Bank of Baroda).
                    Click on the "Use" button to proceed.
                    <br />   <br />

                    Step 2: Authenticate via DigiLocker
                    The application integrates with DigiLocker to fetch your Aadhaar-based personal information securely.
                    Enter your Aadhaar Number and click "Next".
                    Follow the DigiLocker authentication steps to grant access to your details.
                    Once authenticated, the system will autofill the form using the retrieved information.
                    <br />   <br />

                    Step 3: Complete Additional Questions via Voice Agent
                    After the basic form details are fetched, additional details may be required.
                    Enter your mobile number, and click "Call Now" to receive a call from the voice agent.
                    Choose a language (English or Hindi) for the interaction.
                    The voice agent will ask you the remaining required questions and automatically update the form.
                    <br />   <br />

                    Step 4: Generate Final PDF
                    Once the call is completed and all details are collected, click "Generate New PDF" to create an updated version of the form with all information filled in.
                    <p>Download or print the finalized document for submission.</p>

                </div>
                <div className="mx-2 my-3">
                    <CustomButton
                        buttonName="Close"
                        className='px-3 mt-2 w-100 btn logout-button'
                        onClick={() => setModalShow(false)}
                    />
                </div>
            </>
        )
    }

    const logoutModalBodyFun = () => {
        return (
            <>
                <h3 className='my-3 mb-4 text-center ' style={{ color: '#5b719b' }}>Logout</h3>

                <p className='px-2 text-center' style={{ fontWeight: '450', fontSize: '16px' }}>
                    Are you sure you want to log out?
                </p>

                <div className="mx-2 my-3 mt-4 d-flex gap-3">
                    <CustomButton
                        buttonName="Cancel"
                        className='px-3 mt-2 w-50 btn btn-secondary'
                        onClick={() => setLogoutModalShow(false)}
                    />
                    <CustomButton
                        buttonName={"Logout"}
                        className='px-3 mt-2 w-50 btn logout-button'
                        onClick={() => handleLogout()}
                    />
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar className="header-section" >
                <Container>
                    <Navbar.Brand >
                        <img className='cup' src={Image.adraLogo} alt="adra-logo" width={60} onClick={handleLogoClick} />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    {
                        currentPage === "Home" ?
                            <div className='d-flex justify-content-end gap-2'>
                                <Navbar.Collapse className="">
                                    <div title='Info' className='cup gap-2' onClick={() => setModalShow(true)}>
                                        <BsInfoSquareFill size={34} style={{ color: '#809bce' }} />
                                    </div>
                                </Navbar.Collapse>
                                <Navbar.Collapse className="">
                                    <CustomButton
                                        buttonName="Log out"
                                        className='px-3 btn logout-button'
                                        onClick={() => setLogoutModalShow(true)}
                                    />
                                </Navbar.Collapse>
                            </div>
                            :
                            currentPage === "UpdateInformation" ?
                                <div className='d-flex justify-content-end gap-2'>
                                    <Navbar.Collapse className="">
                                        <CustomButton
                                            title="Back to home"
                                            buttonName={
                                                isMobileScreen ?
                                                    <AiFillHome />
                                                    :
                                                    "Back to home"
                                            }
                                            className='px-3 btn logout-button'
                                            onClick={() => navigate("/home")}
                                        />
                                    </Navbar.Collapse>
                                    <Navbar.Collapse className="">
                                        <CustomButton
                                            buttonName="Log out"
                                            className='px-3 btn logout-button'
                                            onClick={() => setLogoutModalShow(true)}
                                        />
                                    </Navbar.Collapse>
                                </div>
                                :
                                null
                    }


                </Container>
            </Navbar>

            <CustomModal
                show={modalShow}
                modalBody={modalBodyFun()}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            />

            <CustomModal
                show={logoutModalShow}
                modalBody={logoutModalBodyFun()}
                onHide={() => setLogoutModalShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            />

        </>
    )
}

export default Header
