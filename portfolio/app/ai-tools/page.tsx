import type { Metadata } from "next";
import Nav from "@/components/nav";
import AiToolsPage from "@/components/AiToolsPage";

export const metadata: Metadata = {
  title: "AI-Assisted Tooling — Petrina Kinzel",
  description:
    "AI tools built for real production: PolyMind, a grounded readiness checker for 3D & BIM models, and a job-search agent.",
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
