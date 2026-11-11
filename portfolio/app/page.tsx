import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Showcase from "@/components/Showcase";
import About from "@/components/about";
import Projects from "@/components/projects";
import AiWork from "@/components/ai-work";
import Process from "@/components/process";
import Achievements from "@/components/achievements";
import Colophon from "@/components/colophon";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Showcase />
        <About />
        <Projects />
        <AiWork />
        <Process />
        <Achievements />
        <Colophon />
        <Contact />
      </main>
    </>
  );
}
