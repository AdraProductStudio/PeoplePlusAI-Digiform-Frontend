import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import CustomButton from '../../reusable-components/CustomButton';
import Image from '../../utils/images';
import CustomSpinner from '../../reusable-components/CustomSpinner';


export const HomeCards = () => {

    const [loading, setLoading] = useState(false)
    const [loadingAction, setLoadingAction] = useState("")

    const cardsArray = [
        // {
        //     id: 1,
        //     cardImage: Image.SBIForm,
        //     cardTitle: "SBI Form",
        //     name: "SBI.pdf",
        //     cardButtonText: "Use"
        // },
        // {
        //     id: 2,
        //     cardImage: Image.ICICIForm,
        //     cardTitle: "ICICI Form",
        //     name: "ICICI.pdf",
        //     cardButtonText: "Use"
        // },
        // {
        //     id: 3,
        //     cardImage: Image.BankOfBarodaForm,
        //     cardTitle: "Bank of Baroda Form",
        //     name: "Bank_of_baroda.pdf",
        //     cardButtonText: "Use"
        // },
        // {
        //     id: 4,
        //     cardImage: Image.PNBForm,
        //     cardTitle: "Punjab National Bank Form",
        //     name: "PNB.pdf",
        //     cardButtonText: "Use"
        // },
        {
            id: 5,
            cardImage: Image.constructionWorkerForm,
            cardTitle: "Construction Worker Form",
            name: "Construction_worker_form_2.pdf",
            cardButtonText: "Use"
        },

    ]

    useEffect(() => {
        setLoading(false)
    }, [])

    const handleUse = async (selectedPdfName, cardTitle) => {
        setLoading(true)
        setLoadingAction(cardTitle)
        sessionStorage.setItem("selectedPdf", selectedPdfName)
        window.open(sessionStorage.getItem("digiLockerURL"), "_self");
    };

    return (
        <Container className='main-section' fluid>
            <Container>
                <Row className='justify-content-lg-start'>
                    {cardsArray.map((item) => (
                        <Col key={item.id} xs={12} md={6} lg={4} xl={3} className='my-3'>
                            <Card className='w-100 w-sm-50 h-100 '>
                                <Card.Img variant="top" src={item.cardImage} className='img-fluid h-100' alt={item.cardTitle} />
                                <Card.Body>
                                    <Card.Title className='card-title text-center'>{item.cardTitle}</Card.Title>
                                    <div onClick={() => handleUse(item.name, item.cardTitle)} className={`${loading && 'pe-none opacity-50'}`}>
                                        <CustomButton
                                            buttonName={loading && loadingAction === item.cardTitle ? <CustomSpinner variant="light" size="sm" /> : item.cardButtonText}
                                            className={`btn custom-button-sm`}
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
