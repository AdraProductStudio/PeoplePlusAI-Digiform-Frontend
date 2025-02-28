import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';




const Header = ({ currentPage }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")
        sessionStorage.removeItem("digiLockerURL")
        sessionStorage.removeItem("digiLockerAccessId")
        sessionStorage.removeItem("conversationId")
        sessionStorage.removeItem("serviceId")
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
                    (currentPage === "Home" || currentPage === "UpdateInformation") &&
                    <Navbar.Collapse className="justify-content-end">
                        <CustomButton
                            buttonName="Logout"
                            className='px-3 btn logout-button'
                            onClick={handleLogout}
                        />
                    </Navbar.Collapse>
                }

            </Container>
        </Navbar>
    )
}

export default Header
