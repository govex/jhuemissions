
import styles from "./homepage.module.scss"
import TopBar from "../../components/topBar/topbar"
import Footer from "../../components/footer/footer"
import { useState, useEffect } from "react"
import Button from "../../components/button/button"
import Card from "../../components/card/card"
import ModalRoot from '../../components/modal/ModalRoot';
import ModalService from '../../components/modal/ModalServices';
import TestModal from '../../components/modal/TestModal';
import  Form  from "../../components/form/Form"
// import BarChart from "../../utils/BarChart";
import * as d3 from "d3";
function Homepage() {
  const addModal = () => {
    ModalService.open(TestModal);
  };
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
        <section className={styles.Info}>

          <div className={styles.left}>

            <span className={styles['c-heading']}>Climate Dashboard</span>
            <p className={styles.para}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </p>

          </div>
          <div className={styles.right}>
            <p className={styles.para}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <Button 
              type="border"
              icon="right-arrow"
              text="Go to the About Section"
              color="secondary"
              size="large"
              href="/about"
            />
          </div>

        </section>


        {/* <div className="graph">
            {loading && <div>loading</div>}
            {!loading && <BarChart data={data} />}
          </div> */}


      </div>
      <div>
      </div>
      <div className={styles.cards}>
        <Card
          text1="Total Emissions (EPA)"
          text3Color="#FF5733"
        />
        <Card
          text1="Total Trips Taken (miles)"
          text3Color="#E49835"
        />
        <Card
          text1="Carbon Footprint"

          text3Color="#558D1C"
        />
      </div>
      <div>
        <ModalRoot />
        <Button 
          type="solid"
          text="Filters"
          color="secondary"
          size="medium"
          onClick={addModal}
        />
      </div>
      <div>
        <Form />
      </div>
    </>
  )
}

export default Homepage
