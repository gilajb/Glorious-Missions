import Icon from "../../components/Icon";

export default function ScriptureGreeting() {
  return (
    <div className="bg-surface-container-low p-space-lg rounded-xl shadow-sm relative overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary-fixed/20 pointer-events-none" />
      <div className="flex items-start gap-space-sm relative">
        <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
          <Icon name="auto_stories" className="text-[20px]" />
        </div>
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
            Scripture Greeting
          </span>
          <p className="font-display text-[17px] italic text-on-surface mt-space-xxs leading-relaxed">
            &ldquo;Share with the Lord&rsquo;s people who are in need. Practice hospitality.&rdquo;
          </p>
          <span className="font-label-sm text-label-sm text-on-surface-variant block mt-space-xxs">
            Romans 12:13
          </span>
        </div>
      </div>
    </div>
  );
}
