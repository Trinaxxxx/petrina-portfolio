import type { Metadata } from "next";
import Nav from "@/components/nav";
import TechnicalBreakdowns from "@/components/TechnicalBreakdowns";

export const metadata: Metadata = {
  title: "Technical Breakdowns — Petrina Kinzel",
  description:
    "Deep-dive process breakdowns: CAD-to-real-time pipelines, Blender Python automation, and real-time VR optimisation techniques.",
};

export default function Page() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "60px" }}>
        <TechnicalBreakdowns />
      </main>
    </>
  );
}
