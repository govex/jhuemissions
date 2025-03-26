
import styles from "./homepage.module.scss"
import { useState, useEffect } from "react"
import Button from "~/components/button/button";
import Card from "~/components/card/card";
import { Popover } from "@mui/material";
import Filter from "~/components/filter/Filter";
import Form from "~/components/form/Form";
import Donut from "~/components/donut/donut";
import Infographic from "~/components/infographic/infographic";
// import BarChart from "../../utils/BarChart";
import * as d3 from "d3";
import type { Route } from "./+types/homepage";
import { BarChart } from "@mui/x-charts/BarChart"


interface DataPoint {
  label: string;
  value: number;
}


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "JHU Travel Emissions Dashboard" },
    { name: "JHU Travel Emissions Dashboard", content: "Welcome to the JHU Travel Emissions Dashboard!" },
  ];
}
function Homepage() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const handleFilterClick = (event: any) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popover' : undefined;

  useEffect(() => {
    d3.csv("./chart-data.csv").then((csvData) => {
      const formattedData = csvData.map((d) => ({
        label: d.group,
        value: +d.val, // Convert value to a number
      }));
      setData(formattedData);
      setLoading(false);
    }).catch((error) => console.error("Error loading CSV:", error));
  }, []);
  const maxVal = Math.max(...data.map((d) => d.value));
  const barColors = data.map((val) => {
    if (val.value === maxVal) {
      return "#002D72";
    
    } else {
      return "#AAA"; // non-max and non-min values take default color of series
    }
  });
  return (
    <>
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
            onClick={handleFilterClick}
          />
          <Popover
            id={filterId}
            open={filterOpen}
            anchorEl={filterAnchorEl}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{
              "& .MuiPopover-paper": {
                "background-color": "transparent",
                "border-radius": "30px"
              }
            }}
          >
            <Filter close={handleFilterClose} />
          </Popover>
        </div>
        <div className={styles.kpi1}>
          <Card
            title="Total GHC Emissions"
          >
            <Infographic
              data={[{ year: 2024, value: 40506, change: -0.03 }]}
            />
          </Card>
        </div>
        <div className={styles.kpi2}>
          <Card
            title="Total Trips Taken"
          >
            <Infographic
              data={[{ year: 2024, value: 40506, change: -0.03 }]}
            />
          </Card>
        </div>
        <div className={styles.kpi3}>
          <Card
            title="Total Miles Travelled"
          >
            <Infographic
              data={[{ year: 2024, value: 40506, change: -0.03 }]}
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
        <div className={styles.bar1}>
          <Card
            title="What group is traveling the most"

          >
            <BarChart className={styles.bar11}

              layout="horizontal"
              xAxis={[
                { 
                  scaleType: "linear",
                
                }]}
              yAxis={[
                { scaleType: "band", 
                  data: data.map((item) => item.label), 
                  disableTicks: true,
                  colorMap: {
                    type: "ordinal",
                    
                    colors: barColors,
                  },
                }

              ]}
              series={[
                {
                  data: data.map((item) => item.value),
                  
                },
              ]}
              width={600}
              height={400}
              bottomAxis={null}
              sx={{
                // Customize x-axis line (grey, thick)
                "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                  stroke: "#CCC",
                  strokeWidth: 4,
                  color: "#000",
                  
                  

                },


              }}
              barLabel="value"


            />

          </Card>
        </div>
        <div className={styles.bar2}>
          <Card
            title="What group is traveling the most"
          >
          </Card>
        </div>
      </section>
    </>
  )
}

export default Homepage
