import React from "react";
import HeroSlider from "./components/HeroSection";
import MarqueeTagLine from "./components/MarqueeTagLine";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";

const Home = () => {
  return (
    <>
      <HeroSlider />
      <MarqueeTagLine />
      <AboutUs />
      <ContactUs />
    </>
  );
};

export default Home;
