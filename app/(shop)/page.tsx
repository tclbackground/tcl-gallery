export const dynamic = "force-dynamic";

import Hero from "@/components/Hero/Hero";
import NewArrivals from "@/components/Home/NewArrival";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import TestimonialSection from "@/components/Testimonial/TestimonialSection";
import Newletter from "@/components/Home/Newletter";
import Footer from "@/components/Footer/Footer";
import BlogSection from "@/components/Home/BlogSection";
import MaisonDeMeraki from "@/components/MaisonDeMeraki/page";
// import DiscountPopup from "@/components/DiscountPopup"; // Adjust import path if saved elsewhere

export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <BlogSection />
      <MaisonDeMeraki />
      <WhyChooseUs />
      <TestimonialSection />
      <Newletter />
      <Footer />

      {/* Modern Discount Popup */}
      {/* <DiscountPopup /> */}
    </>
  );
}