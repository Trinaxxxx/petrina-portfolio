import type { Metadata } from "next";
import Nav from "@/components/nav";
import AiToolsPage from "@/components/AiToolsPage";

export const metadata: Metadata = {
  title: "AI-Assisted Tooling — Petrina Kinzel",
  description:
    "AI tools built for real production: Blender pipeline automation written with GPT, a 3D scene optimisation advisor, and a job-search agent.",
};

export default function Page() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "60px" }}>
        <AiToolsPage />
      </main>
    </>
  );
}
