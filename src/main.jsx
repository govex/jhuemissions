import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import About from './routes/about/about.jsx'
import { BrowserRouter , Route , Routes} from 'react-router'
import './index.css'
import App from './App.jsx'
import Methodology from './routes/methodology/methodology.jsx'
import Homepage from './routes/homePage/homepage.jsx'
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="methodology" element={<Methodology />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter >
  </StrictMode>,
)
