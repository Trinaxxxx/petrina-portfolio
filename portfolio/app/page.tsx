import Nav from "@/components/nav";
import HeroCinematic from "@/components/HeroCinematic";
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
        <HeroCinematic />
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
