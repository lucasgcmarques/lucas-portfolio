import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Showcase from "./components/Showcase";
import Contact from "./components/Contact";
import ThreeCube from "./components/ThreeCube";

export default function Home() {
  return (
    <>
      <ThreeCube />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Portfolio />
        <Showcase />
        <Contact />
      </main>
    </>
  );
}
