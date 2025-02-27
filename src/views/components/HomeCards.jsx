import React, { useContext, useRef, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images';
import axiosInstance from '../../services/axiosInstance';
import CustomSpinner from '../../reusable-components/CustomSpinner';
import { toast } from 'react-toastify';
import CommonContext from '../../hooks/CommonContext';



export const HomeCards = () => {

    const navigate = useNavigate()

    const {
        fetchedPdfBlobFile,
        setFetchedPdfBlobFile
    } = useContext(CommonContext)

    const [loading, setLoading] = useState(false)



    const cardsArray = [
        {
            id: 1,
            cardImage: Image.SBIForm,
            cardTitle: "SBI",
            cardButtonText: "Use"
        },
        // {
        //     id: 2,
        //     cardImage: Image.KYCForm,
        //     cardTitle: "KYC form",
        //     cardButtonText: "Use"
        // },
        // {
        //     id: 3,
        //     cardImage: Image.KYCForm,
        //     cardTitle: "KYC form",
        //     cardButtonText: "Use"
        // },
        // {
        //     id: 4,
        //     cardImage: Image.KYCForm,
        //     cardTitle: "KYC form",
        //     cardButtonText: "Use"
        // },
        // {
        //     id: 5,
        //     cardImage: Image.KYCForm,
        //     cardTitle: "KYC form",
        //     cardButtonText: "Use"
        // },

    ]



    const handleUse = async () => {
        navigate("/update-information");
    };



    return (
        <Container className='main-section' fluid>
            <Container>
                <Row className='gap-3 justify-content-sm-center justify-content-lg-start'>
                    {cardsArray.map((item) => (
                        <Col key={item.id} xs={12} md={6} lg={4} xl={3} className='my-3 '>
                            <Card className='w-100 w-sm-50 h-100'>
                                <Card.Img variant="top" src={item.cardImage} />
                                <Card.Body>
                                    <Card.Title className='card-title'>{item.cardTitle}</Card.Title>
                                    <div onClick={() => {
                                        window.open(Cookies.get("digiLockerURL"), "_self");
                                        // handleUse()
                                    }}>
                                        <CustomButton
                                            buttonName={loading ? <CustomSpinner variant="light" size="sm" /> : item.cardButtonText}
                                            className={`btn custom-button-sm ${loading && 'pe-none opacity-50'}`}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>
    )
}
