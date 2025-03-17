
import './app.css'
import Footer from './components/footer/footer.jsx'
import TopBar from './components/topBar/topbar.jsx'

function App() {


  return (
    <>
      <div>
        <TopBar />
        <Footer />
        <section className='Info'>

          <div className="left">

            <span>Climate Dashboard</span>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </p>

          </div>
          <div className="right">
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <span className='btn-abt'>Go to the About Section</span>
          </div>

        </section>
      </div>
    </>
  )
}

export default App
