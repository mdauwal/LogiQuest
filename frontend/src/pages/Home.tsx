import FaqsSection from "../components/FaqsSection";
import Footer from "../components/Footer";

import WhyShouldYouPlaySection from "../components/WhyShouldYouPlaySection";
import Navbar from "../components/Navbar";
const Home = () => {
  return (
    <>
      {/* paste your page component below here */}
       

        <Navbar />
         <WhyShouldYouPlaySection/>
        <FaqsSection/>

        <Footer />
      {/* paste your page component above here */}
    </>
  );
};

export default Home;
