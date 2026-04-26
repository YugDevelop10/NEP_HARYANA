import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Leadership from './components/Leadership/Leadership'
import AboutSystem from './components/AboutSystem/AboutSystem'
import Schemes from './components/Schemes/Schemes'

function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Leadership />
        <AboutSystem />
        <Schemes />
      </main>
    </>
  )
}

export default App
