import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WaveLines from "./components/WaveLines";
import BimScene from "./components/BimScene";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import About from "./components/About";
import Contact from "./components/Contact";
import VideoShowcase from "./components/VideoShowcase";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main>
        <Hero />
        <WaveLines />
        <BimScene />
        <Services />
        <VideoShowcase />
        <Portfolio />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
