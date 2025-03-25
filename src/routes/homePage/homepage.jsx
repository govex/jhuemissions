
import styles from "./homepage.module.scss"
import cx from "classnames";
import TopBar from "../../components/topBar/topbar"
import Footer from "../../components/footer/footer"
import { useState, useEffect } from "react"
import Button from "../../components/button/button"
import Card from "../../components/card/card"
import ModalRoot from '../../components/modal/ModalRoot';
import ModalService from '../../components/modal/ModalServices';
import TestModal from '../../components/modal/TestModal';
import  Form  from "../../components/form/Form"
import Donut from "../../components/donut/donut";
import Infographic from "../../components/infographic/infographic";
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
      <TopBar />
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
      <section className={styles.grid}>
          <div className={styles.filter}>
            <Button 
              type="solid"
              text="Filters"
              color="secondary"
              size="medium"
              onClick={addModal}
            />
            <ModalRoot />
          </div>
          <div className={styles.kpi1}>
            <Card
              title="Total GHC Emissions"
            >
              <Infographic 
                data={[{year: 2024, value: 40506, change: -0.03}]}
              />
            </Card>
          </div>
          <div className={styles.kpi2}>
            <Card
              title="Total Trips Taken"
            >
              <Infographic 
                data={[{year: 2024, value: 40506, change: -0.03}]}
              />
            </Card>
          </div>
          <div className={styles.kpi3}>
            <Card
              title="Total Miles Travelled"
            >
              <Infographic 
                data={[{year: 2024, value: 40506, change: -0.03}]}
              />
            </Card>
          </div>
          <div className={styles.donut}>
            <Card
              title="How complete is our data?"
            >
              <Donut
                data={.75}
              />
              <p>There is a gap between reporting in data and totals we know.</p> 
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proid</p>
            </Card>
          </div>
          <div className={styles.method}>
            <Card
              title="How did we calculate the emissions?"
            >
              <p>Calculated all emissions using the distance based method, please click the link below to learn more.</p> 
              <Button
                text="Click to learn more"
                type="solid"
                color="secondary"
                size="medium"
                href="/methodology"
              />
            </Card>
            </div>
          <div className={styles.tool}>
            <Form />
          </div>
      </section>
      <Footer />

    </>
  )
}

export default Homepage
