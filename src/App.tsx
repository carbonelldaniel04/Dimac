import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Services from './components/Services';
import Booking from './components/Booking';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import Admin from './components/Admin';
import Login from './components/Login';

function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Services />
      <Booking />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="outer-frame">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
          <ChatAssistant />
        </div>
      </div>
    </Router>
  );
}

