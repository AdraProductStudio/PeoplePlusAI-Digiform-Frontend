import React from 'react'
import Header from '../components/Header'
import { Container } from 'react-bootstrap'
import Footer from '../components/Footer'

const PageNotFound = () => {
    return (
        <section className='layout'>
            <Header />
            <Container className='main-section d-flex justify-content-center align-items-center' fluid >
                <h1 style={{color:'#667da7'}}>Page Not Found</h1>
            </Container >
            <Footer isFooterText={true} />
        </section>
    )
}

export default PageNotFound
