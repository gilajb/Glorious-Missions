import Creed from "./About/Creed";
import Genesis from "./About/Genesis";
import Hero from "./About/Hero";
import Leadership from "./About/Leadership";
import Tenets from "./About/Tenets";
import TransparencyBar from "./About/TransparencyBar";

export default function About() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Genesis />
      <Tenets />
      <Leadership />
      <Creed />
      <TransparencyBar />
    </div>
  );
}
