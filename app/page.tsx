import Brands from "../components/Brands";
import ScrollUp from "../components/Common/ScrollUp";
import Feedback from "../components/Feedback";
import Features from "../components/Features";
import Hero from "../components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuietSpace",
  description: "This is your place to find a quietspace",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />

      <Brands />

      <Feedback />
    </>
  );
}
