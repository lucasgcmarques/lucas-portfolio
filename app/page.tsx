import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Showcase from "./components/Showcase";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <Showcase />
        <Contact />
      </main>
    </>
  );
}
