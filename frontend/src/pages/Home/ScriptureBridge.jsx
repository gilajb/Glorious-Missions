import Icon from "../../components/Icon";

export default function ScriptureBridge() {
  return (
    <section className="w-full bg-surface-container-low py-space-2xl">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop text-center flex flex-col items-center">
        <Icon name="church" className="text-primary text-[32px] mb-space-xs" />
        <blockquote className="font-headline-md text-headline-md text-on-surface max-w-3xl italic font-normal">
          &ldquo;How beautiful upon the mountains are the feet of him who brings good news, who
          publishes peace, who brings good news of happiness.&rdquo;
        </blockquote>
        <span className="font-label-md text-label-md text-primary font-bold tracking-widest uppercase mt-space-sm">
          Isaiah 52:7
        </span>
      </div>
    </section>
  );
}
