import AmenitiesSection from "@/component/pages/home/AmenitiesSection";
import ExclusiveLuxurySection from "@/component/pages/home/ExclusiveLuxurySection";
import ExclusiveLuxurySection2 from "@/component/pages/home/ExclusiveLuxurySection2";
import Header from "@/component/pages/home/Header";
import IntroSection from "@/component/pages/home/IntroSection";
import RoomsAndSuites from "@/component/pages/home/RoomsAndSuites";
import { FooterLayout } from "@/component/reusable/footer";
import Navbar from "@/component/reusable/navbar";
import Image from "next/image";
import Headerbg from "../../public/bg/headerbg.png";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Header />
      <IntroSection />
      <ExclusiveLuxurySection />
      <RoomsAndSuites />
      <AmenitiesSection />
      <ExclusiveLuxurySection2 />
      <div className="py-20">
        <Image
          alt=""
          src={Headerbg}
          width={400}
          height={400}
          className="w-full h-[300px] object-cover"
        />
      </div>
      <FooterLayout />
    </div>
  );
}
