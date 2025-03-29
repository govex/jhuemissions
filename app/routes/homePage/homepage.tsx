
import styles from "./homepage.module.scss";
import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import Button from "~/components/button/button";
import Card from "~/components/card/card";
import { Popover } from "@mui/material";
import Filter from "~/components/filter/Filter";
import Form from "~/components/form/Form";
import Infographic from "~/components/infographic/infographic";
import * as d3 from "d3";
import type { InternMap } from "d3";
import type { Route } from "./+types/homepage";
import BarChartVariants from "~/components/barChart/barChart";
import { ConnectionMap } from "~/components/connectionMap/connectionMap";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "JHU Travel Emissions Dashboard" },
    { name: "JHU Travel Emissions Dashboard", content: "Welcome to the JHU Travel Emissions Dashboard!" },
  ];
}
export type DataPoint = {
  fiscalyear: string;
  school: string;
  total_emissions: number;
  total_trips: number;
  percent_total_emissions: number;
  percent_total_trips: number;
  total_miles: number;
  average_miles: number;
}

function Homepage() {
  const [data, setData] = useState<InternMap<string,DataPoint[]> | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const bar1ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const handleFilterClick = (event:MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popover' : undefined;

  useEffect(() => {
    d3.csv("./data/chart-data.csv", (d)=>{
      return {
        fiscalyear: d.fiscalyear,
        school: d.school,
        total_emissions: +d.total_emissions,
        total_trips: +d.total_trips,
        percent_total_emissions: +d.percent_total_emissions,
        percent_total_trips: +d.percent_total_trips,
        total_miles: +d.total_miles,
        average_miles: +d.average_miles
      } as DataPoint;
    }).then((d) => {
      let grouped = d3.group(d, d => d.fiscalyear)
      setData(grouped);
      setLoading(false);
    }).catch((error) => console.error("Error loading CSV:", error));
  }, []);

  return (
    <>
      <section className={styles.hero}>
      <h1>Travel Emissions Dashboard</h1>
      <div className={styles.info}>
      <div className={styles.left}>
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
                  "backgroundColor": "transparent",
                  "borderRadius": "30px",
                  "marginTop": "10px",
                }
              }}
            >
              <Filter close={handleFilterClose} />
            </Popover>
          </Card>
        </div>
        <div className={styles.tool}>
          <Form />
        </div>
        <div className={styles.bar1}>
          <Card
            title="What group is traveling the most"
          >
            <div className={styles.chartContainer} ref={bar1ref}>
              {!loading && bar1ref?.current && !!data &&
                <BarChartVariants 
                  data={data}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar1ref.current.getBoundingClientRect()}
                  labelField={"school" as keyof DataPoint["school"]}
                  valueField={"total_trips" as keyof DataPoint["total_trips"]}
                  year={["FY202425"]}
                />
              }
            </div>
          </Card>
        </div>
        <div className={styles.bar2}>
          <Card
            title="What group is traveling the most"
          >
            <p>chart placeholder</p>
          </Card>
      </div>
      <div className={styles.map}>
        <Card title="Where are people travelling?">
          <div className={styles.chartContainer} ref={mapRef}>
            {mapRef?.current &&
              <ConnectionMap
                parentRect={mapRef.current.getBoundingClientRect()} 
              />
            }
          </div>
        </Card>
      </div>
      <div className={styles.tool}>
        <Form />
      </div>
    </section>
    </>
  )
}

export default Homepage
