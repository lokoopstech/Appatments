import { useEffect } from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import AboutUs from "../Components/About/About";
import Apartments from "../Components/Apartments/Apartments";

const Shop =()=>{
    return(
        <>
       <HeroSection/>
        <Apartments/>
       <AboutUs/>
        </>
    )
}
export default Shop