import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Leadership from './components/Leadership/Leadership'

function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Leadership />
      </main>
    </>
  )
}

export default App
