import React, { useEffect } from 'react';
import Header from '../sections/header';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div className="App">
      <FeaturesSection />
      <HowItWorksSection />


    </div>
  );
}

export default Home;
