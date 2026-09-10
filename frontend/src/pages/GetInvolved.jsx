import FaqBanner from "./GetInvolved/FaqBanner";
import Hero from "./GetInvolved/Hero";
import Pillars from "./GetInvolved/Pillars";
import VolunteerForm from "./GetInvolved/VolunteerForm";

export default function GetInvolved() {
  return (
    <div className="flex flex-col w-full">
      <Hero />

      <section className="w-full py-space-2xl md:py-space-4xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-gutter-desktop items-start">
          <div className="lg:col-span-7">
            <Pillars />
          </div>
          <div className="lg:col-span-5 w-full">
            <VolunteerForm />
          </div>
        </div>
      </section>

      <FaqBanner />
    </div>
  );
}
