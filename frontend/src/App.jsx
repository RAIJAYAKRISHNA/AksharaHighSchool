import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/common/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Academics from "./pages/Academics.jsx";
import Admissions from "./pages/Admissions.jsx";
import Facilities from "./pages/Facilities.jsx";
import StudentLife from "./pages/StudentLife.jsx";
import Gallery from "./pages/Gallery.jsx";
import Events from "./pages/Events.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/student-life" element={<StudentLife />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;