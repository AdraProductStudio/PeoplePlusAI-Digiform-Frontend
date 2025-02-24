import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MultistepForm from '../components/MultistepForm'
import '../../stylesheets/UpdateInformation.css'

const UpdateInformation = () => {
    return (
        <>
        <Header currentPage="UpdateInformation"/>
        <MultistepForm />
        <Footer isFooterText={false}/>
     </>
    )
}

export default UpdateInformation
