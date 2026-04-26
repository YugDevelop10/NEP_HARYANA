import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Leadership from './components/Leadership/Leadership'
import AboutSystem from './components/AboutSystem/AboutSystem'
import Schemes from './components/Schemes/Schemes'
import StatsAndNews from './components/StatsAndNews/StatsAndNews'

function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Leadership />
        <AboutSystem />
        <Schemes />
        <StatsAndNews />
      </main>
    </>
  )
}

export default App
