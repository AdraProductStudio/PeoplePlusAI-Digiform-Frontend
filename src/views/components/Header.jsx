import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';




const Header = ({ currentPage }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        Cookies.remove("digiLockerURL")
        Cookies.remove("digiLockerAccessId")
        navigate("/");
    }

    return (
        <Navbar className="header-section" >
            <Container>
                <Navbar.Brand href="https://adraproductstudio.com/" target='_blank'>
                    <img src={Image.adraLogo} alt="adra-logo" width={60} />
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
