import { Link } from "react-router-dom";

import Icon from "../../components/Icon";

export default function Creed() {
  return (
    <section
      id="theological-creed"
      className="w-full py-space-3xl md:py-space-4xl bg-surface-container-high relative overflow-hidden scroll-mt-20"
    >
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1024px] mx-auto text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center mb-space-md shadow-sm">
          <Icon name="auto_stories" className="text-[24px]" />
        </div>
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold mb-space-xs">
          Our Confession of Faith
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-lg">
          Faith Expressed Through Deeds of Love
        </h2>

        <div className="bg-surface-container-lowest p-space-xl md:p-space-2xl rounded-2xl shadow-md text-left w-full mb-space-xl">
          <div className="flex flex-col gap-space-md font-body-lg text-body-lg text-on-surface leading-relaxed">
            <p className="font-display text-[22px] italic text-primary leading-relaxed text-center pb-space-sm">
              &ldquo;For in Christ Jesus neither circumcision nor uncircumcision has any value.
              The only thing that counts is faith expressing itself through love.&rdquo;
              <span className="block font-label-md text-label-md uppercase tracking-widest text-on-surface-variant not-italic mt-space-xxs">
                &mdash; Galatians 5:6
              </span>
            </p>
            <div className="h-[1px] w-full bg-surface-variant my-space-xs" />
            <p>
              We affirm the historic Christian faith: that God so loved the world He gave His
              only Son to redeem humanity and restore creation.
            </p>
            <p>
              Our mission is not colonialism in Christian vocabulary. It's the joyful
              proclamation of Christ's kingdom through servant hands. We honor local culture,
              language, and tradition as reflections of God's creativity. We go where we're
              invited, listen before we speak, and stay steadfast through trial and drought.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-space-md">
          <Link
            to="/get-involved"
            className="inline-flex items-center gap-space-xs px-space-xl py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-md hover:bg-primary/95 transition-all"
          >
            <Icon name="handshake" className="text-[20px]" />
            <span>Partner With Our Field Team</span>
          </Link>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-space-xs px-space-xl py-space-sm bg-surface text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm hover:bg-surface-container transition-colors"
          >
            <Icon name="photo_camera" className="text-[20px]" />
            <span>Explore the Visual Chronicles</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
