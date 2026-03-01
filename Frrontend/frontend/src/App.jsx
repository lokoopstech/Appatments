import { Router,Route,Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Careers from './Components/Careers/Careers'
import BookNow from './Components/BookNow/BookNow'
import ContactUs from './Components/ContactUs/ContactUs'
import AboutUs from './Components/About/About'
import Shop from './Pages/Shop'
import Apartments from './Components/Apartments/Apartments'
import Visit from './Components/Visit/Visit'
import Services from './Components/Services/Services'
import Footer from './Components/Footer/Footer'
import Policy from './Components/Policy/Policy'
import Cookie from './Components/Coockie/Cookie'
import Faq from './Components/Faq/Faq'
import Blogs from './Components/Blogs/Blogs'
import Loader from './Components/Loader/Loader';
import { useState, useEffect } from 'react'
import MissionVision from './Components/MissionVision/MissionVision'
import Gallery from './Components/Gallery/Gallery'

//  <h1>online application link https://forms.office.com/r/4G0KYCa93h</h1>
const LOADER_DURATION = 2800; 
function App() {
  


  //  const [loading, setLoading] = useState(true);
  // const [exiting, setExiting] = useState(false);

  // useEffect(() => {
  //   // After LOADER_DURATION ms, trigger the exit animation
  //   const exitTimer = setTimeout(() => {
  //     setExiting(true);
  //   }, LOADER_DURATION);

  //   // After exit animation completes (600ms), unmount the loader
  //   const doneTimer = setTimeout(() => {
  //     setLoading(false);
  //   }, LOADER_DURATION + 600);

  //   return () => {
  //     clearTimeout(exitTimer);
  //     clearTimeout(doneTimer);
  //   };
  // }, []);

  // While loading, show only the Loader (full-screen)
  // if (loading) {
  //   return <Loader exiting={exiting} />;
  // }
 

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    
  
    <Routes>
      <Route path='/' element={<Shop/>} ></Route>
      <Route path='/home' element={<Shop/>} ></Route>
     <Route path='/careers' element={<Careers/>} ></Route>
      <Route path='/careers' element={<App/>} ></Route>
     <Route path='/book-now' element={<BookNow/>} ></Route>
     <Route path='/contact-us' element={<ContactUs/>} ></Route>
     <Route path='/about' element={<AboutUs/>} ></Route>
     <Route path='/our-apartments' element={<Apartments/>} ></Route>
     <Route path='/visit' element={<Visit/>} ></Route>
     <Route path='/gallery' element={<Gallery/>} ></Route>
      <Route path='/services' element={<Services/>} ></Route>
      <Route path='/blogs' element={<Blogs/>} ></Route>
      <Route path='/policy&Privacy' element={<Policy/>} ></Route>
      <Route path='/cookies' element={<Cookie/>} ></Route>
      <Route path='/faq' element={<Faq/>} ></Route>
    </Routes>
    <MissionVision/>
    <Footer/>
    </BrowserRouter>
  

    </>
  )
}

export default App
