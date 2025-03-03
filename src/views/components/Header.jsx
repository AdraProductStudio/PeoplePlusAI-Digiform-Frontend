import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images'
import { useNavigate } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";



const Header = ({ currentPage }) => {
    const navigate = useNavigate()

    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")
        sessionStorage.removeItem("digiLockerURL")
        sessionStorage.removeItem("digiLockerAccessId")
        sessionStorage.removeItem("conversationId")
        sessionStorage.removeItem("serviceId")
        sessionStorage.removeItem("selectedPdf")
        navigate("/");
    }

    return (
        <Navbar className="header-section" >
            <Container>
                <Navbar.Brand href="https://adraproductstudio.com/" target='_blank'>
                    <img src={Image.companyLogo} alt="adra-logo" width={140} />
                </Navbar.Brand>
                <Navbar.Toggle />
                {
                    currentPage === "Home" ?
                        <Navbar.Collapse className="justify-content-end">
                            <CustomButton
                                buttonName="Log out"
                                className='px-3 btn logout-button'
                                onClick={handleLogout}
                            />
                        </Navbar.Collapse>
                        :
                        currentPage === "UpdateInformation" ?
                            <div className='d-flex justify-content-end gap-2'>
                                <Navbar.Collapse className="">
                                    <CustomButton
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
                                        onClick={handleLogout}
                                    />
                                </Navbar.Collapse>
                            </div>
                            :
                            null
                }


            </Container>
        </Navbar>
    )
}

export default Header
