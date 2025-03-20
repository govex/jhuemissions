
import "./homepage.css"
import TopBar from "../../components/topBar/topbar"

import Footer from "../../components/footer/footer"
import {useState, useEffect} from "react"

// import BarChart from "../../utils/BarChart";
import * as d3 from "d3";
function Homepage() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    d3.csv("./chart-data.csv").then((d) => {
      setData(d);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  return (
    <>
      <div>
        <TopBar />
        <Footer />
        <section className='Info'>

          <div className="left">

            <span className='c-heading'>Climate Dashboard</span>
            <p className='para'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </p>

          </div>
          <div className="right">
            <p className="para">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p className='btn-abt'>Go to the About Section</p>
          </div>

        </section>


          {/* <div className="graph">
            {loading && <div>loading</div>}
            {!loading && <BarChart data={data} />}
          </div> */}


      </div>
    </>
  )
}

export default Homepage
