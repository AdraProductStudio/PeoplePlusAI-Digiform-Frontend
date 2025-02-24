import React from 'react'
import { Container, Navbar } from 'react-bootstrap'

const Footer = ({ isFooterText }) => {
  return (
    <Navbar className="footer-section">
      <Container className='justify-content-center'>
        {
          isFooterText ?
            <Navbar.Text className='text-dark'>
              Copyright ©2025 Powered by  <a href="https://adraproductstudio.com/" target='_blank'>ADRA</a>
            </Navbar.Text>
            : null
        }
      </Container>
    </Navbar>
  )
}

export default Footer
