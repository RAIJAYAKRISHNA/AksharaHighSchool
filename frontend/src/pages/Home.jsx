import Hero from "../components/home/Hero.jsx";
import Highlights from "../components/home/Highlights.jsx";
import AboutPreview from "../components/home/AboutPreview.jsx";
import AcademicJourney from "../components/home/AcademicJourney.jsx";
import WhyChooseUs from "../components/home/WhyChooseUs.jsx";
import SchoolLife from "../components/home/SchoolLife.jsx";
import CTA from "../components/home/CTA.jsx";

function Home() {
  return (
    <main>
      <Hero />
      <Highlights />
      <AboutPreview />
      <AcademicJourney />
      <WhyChooseUs />
      <SchoolLife />
      <CTA />
    </main>
  );
}

export default Home;