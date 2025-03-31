
import styles from "./homepage.module.scss";
import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, MouseEvent, SyntheticEvent } from "react";
import Button from "~/components/button/button";
import Card from "~/components/card/card";
import { Popover, type AutocompleteChangeReason } from "@mui/material";
import Filter from "~/components/filter/Filter";
import Form from "~/components/form/Form";
import Infographic from "~/components/infographic/infographic";
import * as d3 from "d3";
import type { InternMap } from "d3";
import type { Route } from "./+types/homepage";
import BarChartVariants from "~/components/barChart/barChart";
import { ConnectionMap } from "~/components/connectionMap/connectionMap";
import Toggle from "~/components/toggle/toggle";
import {toTitleCase} from "~/utils/titleCase";
import {filterInternMap} from "~/utils/mapFilter";
import Timeline from "~/components/timeline/timeline";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "JHU Travel Emissions Dashboard" },
    { name: "JHU Travel Emissions Dashboard", content: "Welcome to the JHU Travel Emissions Dashboard!" },
  ];
}
export type DataPoint = {
  fiscalyear: string;
  school: string;
  traveler_type: string;
  total_emissions: number;
  total_trips: number;
  // percent_total_emissions: number;
  // percent_total_trips: number;
  // total_miles: number;
  // average_miles: number;
  percapita_trips: number;
  percapita_emissions: number;
}
export type DataPoint2 = {
  fiscalyear: string;
  school: string;
  total_trips: number;
  total_cost: number;
}
type errorText = "Only five years may be displayed at once" | "At least one year must be selected." | undefined;

function Homepage() {
  const [data, setData] = useState<InternMap<string,DataPoint[]> | undefined>(undefined);
  const [data2, setData2] = useState<InternMap<string,DataPoint2[]> | undefined>(undefined);
  const [timelineData, setTimelineData] = useState<InternMap<string, any[]> | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState<boolean>(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [toggleState, setToggleState] = useState<"percapita_trips" | "total_trips">("total_trips");
  const [timeToggleState, setTimeToggleState] = useState<"month" | "quarter">("month");
  const bar1ref = useRef<HTMLDivElement | null>(null);
  const bar2ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const filterErrorTooMany = "Only five years may be displayed at once.";
  const filterErrorNotEnough = "At least one year must be selected.";
  const handleFilterClick = (event:MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleToggleChange = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setToggleState("total_trips")
    } else {
      setToggleState("percapita_trips")
    }
  }  
  const handleTimeToggleChange = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setTimeToggleState("quarter")
    } else {
      setTimeToggleState("month")
    }
  }
  function yearFilterCallback(k,v) {
    let selected = filters.years.flatMap(y => y.split(","));
    return selected.includes(k);
  }
  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popover' : undefined;
  const [filters, setFilters] = useState<{years: string[], school: string}>({years: ["FY23-24"], school: "All"});
  const [filterError, setFilterError] = useState<errorText>(undefined); 
  const handleFilters = (event: ChangeEvent<HTMLInputElement> | {event: SyntheticEvent, value: string, reason: AutocompleteChangeReason}) => {
    if (event.target.checked === false) {
      let checked = Array.from(filters.years);
      console.log(checked);
      if (checked.length === 1) {
        setFilterError(filterErrorNotEnough as errorText);
      } else if (checked.length <= 5) {
        if (checked.indexOf(event.target.value) != -1) {
          if (checked.indexOf(event.target.value) == 0) {
            checked.shift();
          } else {
            checked.splice(checked.indexOf(event.target.value),1)
          }
          setFilterError(undefined)
          setFilters({...filters, years: checked})
        }      
      }
    } else if (event.target.checked) {
      let checked = Array.from(filters.years);
      if (checked.length >= 5) {
        setFilterError(filterErrorTooMany as errorText)
      } else {
        setFilterError(undefined)
        checked.push(event.target.value);
        setFilters({...filters, years: checked})  
      }
    } else {
      setFilters({...filters, school: event.currentTarget.innerText !== '' ? event.currentTarget.innerText : 'All'})
    }
  }
  const [schoolOptions, setSchoolOptions] = useState<string[] | undefined>(undefined)
  useEffect(() => {
    d3.csv("./data/bookings_summary.csv", (d)=>{
      return {
        fiscalyear: d.fiscalyear,
        school: toTitleCase(d.school),
        traveler_type: d.traveler_type,
        total_emissions: +d.total_emissions,
        total_trips: +d.total_trips,
        // percent_total_emissions: +d.percent_total_emissions,
        // percent_total_trips: +d.percent_total_trips,
        // total_miles: +d.total_miles,
        // average_miles: +d.average_miles,
        percapita_trips: +d.percapita_trips,
        percapita_emissions: +d.percapita_emissions
      } as DataPoint;
    }).then((d) => {
      let schools = Array.from(new Set(d.map(r => r.school))).sort()
      setSchoolOptions(["All", ...schools]);
      let grouped = d3.group(d, d => d.fiscalyear)
      setData(grouped);
      setLoading(false);
    }).catch((error) => console.error("Error loading CSV:", error));
    d3.csv("./data/expenses_summary.csv", (d)=>{
      return {
        fiscalyear: d.fiscalyear,
        school: toTitleCase(d.school),
        total_trips: +d.total_trips,
        total_cost: +d.total_cost
      } as DataPoint2;
    }).then((d) => {
      let grouped = d3.group(d, d => d.fiscalyear)
      setData2(grouped);
      setLoading2(false);
    }).catch((error) => console.error("Error loading CSV:", error));
    d3.csv("./data/monthly_emissions_per_year.csv", (d) => {
      let date = Date.UTC(d.year, d.month);
      return {
        month: date.toLocaleString(undefined, {month: "short"}),
        total_emissions_concur: +d.total_emissions_concur,
        total_emissions_epa: +d.total_emissions_epa,
        fiscalyear: d.fiscalyear,
        total_trips: +d.total_trips
      }
    }).then(d => {
      let grouped = d3.group(d, d => d.fiscalyear);
      setTimelineData(grouped);
    }).catch((error) => console.error("Error loading CSV:", error));
  }, []);
  const fiscalYearOptions = [
    {label: "FY24-25", value: "FY24-25"},
    {label: "FY23-24", value: "FY23-24"},
    {label: "FY22-23", value: "FY22-23"},
    {label: "FY21-22", value: "FY21-22"},
    {label: "FY20-21", value: "FY20-21"},
    {label: "FY19-20", value: "FY19-20"},
    {label: "FY18-19", value: "FY18-19"},
    {label: "FY17-18", value: "FY17-18"}
  ]
  return (
    <>
      <section className={styles.hero}>
      <h1>Travel Emissions Dashboard</h1>
      <div className={styles.info}>
        <div className={styles.left}>
            <p className={styles.para}>
            This dashboard aims to communicate the climate emissions impact of business travel to faculty and administrative leaders, inform estimates of JHU air travel scope 3 emissions to allow for better decision making, and foster an enabling environment, driven by faculty priorities, for mitigation efforts that address scope 3 emissions.</p>
        </div>
        <div className={styles.right}>
          <p className={styles.para}>For additional background, please see <a href="https://sustainability.jhu.edu/news/a-climate-dashboard-on-jhu-business-travel-is-scheduled-to-take-off-in-april/">this article</a>. (This instance of the dashboard is a live public beta.)</p>
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
          {schoolOptions?.length && schoolOptions.length > 0 &&
          <>
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
              marginTop: "6px",
              "& .MuiPopover-paper": {
                backgroundColor: "transparent",
                borderRadius: "30px"
              }
            }}
          >
            <Filter 
              close={handleFilterClose} 
              change={handleFilters}
              yearOptions={fiscalYearOptions} 
              schoolOptions={schoolOptions} 
              error={filterError}
              filters={filters}
            />
          </Popover>
          </>
          }
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
          </Card>
        </div>
        <div className={styles.tool}>
          <Card title="Emissions Calculator">
            <Form />
          </Card>
        </div>
        <div className={styles.bar1}>
          <Card
            title="What traveler type is traveling the most?"
          >
            <div className={styles.chartContainer} ref={bar1ref}>
              {!loading2 && bar1ref?.current && !!data2 &&
                <BarChartVariants 
                  data={filterInternMap(data, yearFilterCallback)}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar1ref.current.getBoundingClientRect()}
                  labelField={"traveler_type" as keyof DataPoint["traveler_type"]}
                  valueField={"total_trips" as keyof DataPoint["total_trips"]}
                  school={filters.school}
                />
              }
            </div>
          </Card>
        </div>
        <div className={styles.bar2}>
          <Card
            title="What school/division is traveling the most?"
          >
            <div className={styles.toggleBox}><span>Per Capita</span>
            <Toggle 
              checked={toggleState === "total_trips" ? true : false} 
              onChange={handleToggleChange} 
            />
            <span>Total</span>
            </div>
            <div className={styles.chartContainer} ref={bar2ref}>
              {!loading && bar2ref?.current && !!data &&
                <BarChartVariants 
                  data={filterInternMap(data, yearFilterCallback)}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar2ref.current.getBoundingClientRect()}
                  labelField={"school" as keyof DataPoint["school"]}
                  valueField={toggleState as keyof DataPoint["percapita_trips" | "total_trips"]
                  }
                  school={filters.school}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.time}>
          <Card title="When are people travelling?">
            <div className={styles.toggleBox}>
              <span>Month</span>
              <Toggle 
                checked={timeToggleState === "quarter" ? true : false} 
                onChange={handleTimeToggleChange} 
              />
              <span>Quarter</span>
            </div>
            <div className={styles.chartContainer} ref={timeRef}>
              {!!timelineData && timeRef?.current &&
                <Timeline 
                  data={filterInternMap(timelineData, yearFilterCallback)}
                  parentRect={timeRef.current.getBoundingClientRect()}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.map}>
        <Card title="Where are people travelling?">
          <div className={styles.chartContainer} ref={mapRef}>
            {mapRef?.current &&
              <ConnectionMap
                parentRect={mapRef.current.getBoundingClientRect()} 
                year={["FY202425"]}
                />
            }
          </div>
        </Card>
      </div>
    </section>
    </>
  )
}

export default Homepage
