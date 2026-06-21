import Nav from "@/components/nav";
import Hero from "@/components/hero";
import About from "@/components/about";
import Projects from "@/components/projects";
import Environment from "@/components/environment";
import Process from "@/components/process";
import Achievements from "@/components/achievements";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Environment />
        <Process />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
