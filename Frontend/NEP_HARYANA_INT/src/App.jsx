import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import LeadershipPro from './components/LeadershipPro/LeadershipPro'
import AboutSystem from './components/AboutSystem/AboutSystem'
import Schemes from './components/Schemes/Schemes'
import StatsAndNews from './components/StatsAndNews/StatsAndNews'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <LeadershipPro />
        <AboutSystem />
        <Schemes />
        <StatsAndNews />
      </main>
      <Footer />
    </>
  )
}

export default App
