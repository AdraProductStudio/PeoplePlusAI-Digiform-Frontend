import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { HomeCards } from '../components/HomeCards'

const Home = () => {



  return (
    <section className='layout'>
      <Header currentPage="Home" />
      <HomeCards />
      <Footer isFooterText={true} />
    </section>
  )
}

export default Home
