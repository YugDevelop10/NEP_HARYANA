import Hero from "../../components/Hero/Hero";
import LeadershipSection from "../../components/LeadershipSection/LeadershipSection";
import AboutSystem from "../../components/AboutSystem/AboutSystem";
import Schemes from "../../components/Schemes/Schemes";
import StatsAndNews from "../../components/StatsAndNews/StatsAndNews";

function Home() {
  return (
    <main id="main-content">
      <Hero />
      <LeadershipSection />
      <AboutSystem />
      <Schemes />
      <StatsAndNews />
    </main>
  );
}

export default Home;
