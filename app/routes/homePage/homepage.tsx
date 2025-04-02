
import styles from "./homepage.module.scss";
import cx from "classnames";
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
import {toTitleCase, studentCorrection} from "~/utils/titleCase";
import {filterInternMap} from "~/utils/mapFilter";
import Timeline from "~/components/timeline/timeline";
import Legend from "~/components/legend/legend";

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
  total_distance_miles: number;
  total_distance_km: number;
  median_distance_miles: number;
  median_distance_km: number;
  percapita_trips: number;
  percapita_emissions: number;
}
export type Connection = {
    from_full: string;
    to_full: string;
    from_lat: number;
    from_lng: number;
    to_lat: number;
    to_lng: number;
    total_trips: number;
    total_emissions: number;
    fiscalyear: string;
    school: string;
}
type ConnectionData = Map<string, Connection[]>
type errorText = "Only five years may be displayed at once" | "At least one year must be selected." | undefined;
type TopLineStats = {
  emissions: {
    year: string;
    value: number | undefined;
  }[],
  trips: {
    year: string;
    value: number | undefined;
  }[],
  distance: {
    year: string;
    value: number | undefined;
  }[]
}
function Homepage() {
  const fiscalYearOptions = [
    {label: "FY23-24", value: "FY23-24", order: 7},
    {label: "FY22-23", value: "FY22-23", order: 6},
    {label: "FY21-22", value: "FY21-22", order: 5},
    {label: "FY20-21", value: "FY20-21", order: 4},
    {label: "FY19-20", value: "FY19-20", order: 3},
    {label: "FY18-19", value: "FY18-19", order: 2},
    {label: "FY17-18", value: "FY17-18", order: 1}
  ]
  const colorScale = d3.scaleOrdinal(["#86C8BC", "#E8927C", "#F1C400", "#418FDF", "#000000"]);
  const [data, setData] = useState<InternMap<string,DataPoint[]> | undefined>(undefined);
  const [timelineData, setTimelineData] = useState<InternMap<string, any[]> | undefined>(undefined);
  const [mapData, setMapData] = useState<ConnectionData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [toggleStateTraveler, setToggleStateTraveler] = useState<"total_emissions" | "total_trips">("total_trips");
  const [toggleStateSchool, setToggleStateSchool] = useState<"total_emissions" | "total_trips">("total_trips");
  const top1ref = useRef<HTMLDivElement | null>(null);
  const top2ref = useRef<HTMLDivElement | null>(null);
  const top3ref = useRef<HTMLDivElement | null>(null);
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
  const handleToggleChangeTraveler = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setToggleStateTraveler("total_emissions")
    } else {
      setToggleStateTraveler("total_trips")
    }
  }  
  const handleToggleChangeSchool = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setToggleStateSchool("total_emissions")
    } else {
      setToggleStateSchool("total_trips")
    }
  }  
  function yearFilterCallback(k,v) {
    let selected = filters.years.flatMap(y => y.split(","));
    return selected.includes(k);
  }
  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popover' : undefined;
  const [filters, setFilters] = useState<{years: string[], school: string}>({years: ["FY23-24"], school: "All JHU"});
  const [filterError, setFilterError] = useState<errorText>(undefined); 
  const handleFilters = (event: ChangeEvent<HTMLInputElement> | {event: SyntheticEvent, value: string, reason: AutocompleteChangeReason}) => {
    if (event.target.checked === false) {
      let checked = Array.from(filters.years);
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
          let sorted = checked.sort((a,b)=>{
            let orderA = fiscalYearOptions.find(f => f.label === a)?.order
            let orderB = fiscalYearOptions.find(f => f.label === b)?.order
            return !!orderA && !!orderB ? orderA - orderB : 0
          })
          setFilters({...filters, years: sorted})
        }      
      }
    } else if (event.target.checked) {
      let checked = Array.from(filters.years);
      if (checked.length >= 5) {
        setFilterError(filterErrorTooMany as errorText)
      } else {
        setFilterError(undefined)
        checked.push(event.target.value);
        let sorted = checked.sort((a,b)=>{
          let orderA = fiscalYearOptions.find(f => f.label === a)?.order
          let orderB = fiscalYearOptions.find(f => f.label === b)?.order
          return !!orderA && !!orderB ? orderA - orderB : 0
        })
        setFilters({...filters, years: sorted})
    }
    } else {
      setFilters({...filters, school: event.currentTarget.innerText !== '' ? event.currentTarget.innerText : 'All JHU'})
    }
  }
  const [schoolOptions, setSchoolOptions] = useState<{value:number,label:string}[] | []>([])
  useEffect(() => {
    d3.csv("./data/business_areas_with_headcount.csv", (d)=>{
      return {
        value: +d.code,
        label: toTitleCase(d.school)
      }
    }).then(data => {
      let sorted = data.sort((a,b)=>a.label.localeCompare(b.label));
      let dataPlusAll = [{value:-99, label:"All JHU"}, ...sorted]
      setSchoolOptions(dataPlusAll)})
    d3.csv("./data/bookings_summary.csv", (d)=>{
      return {
        fiscalyear: d.fiscalyear,
        school: toTitleCase(d.school),
        traveler_type: d.traveler_type,
        total_emissions: +d.total_emissions,
        total_trips: +d.total_trips,
        percapita_trips: +d.percapita_trips,
        percapita_emissions: +d.percapita_emissions,
        total_distance_km: +d.total_distance_km,
        total_distance_miles: +d.total_distance_miles,
        median_distance_km: +d.median_distance_km,
        median_distance_miles: +d.median_distance_km
      } as DataPoint;
    }).then((d) => {
      let grouped = d3.group(d, d => d.fiscalyear)
      setData(grouped);
      setLoading(false);
    }).catch((error) => console.error("Error loading CSV:", error));
    d3.csv("./data/monthly_emissions_by_business_area.csv", (d) => {
      let date = new Date(+d.year, +d.month);
      return {
        month: date.toLocaleString(undefined, {month: "short", timeZone: "GMT"}),
        fiscalyear: d.fiscalyear,
        school: toTitleCase(d.school),
        total_trips: +d.total_trips,
        total_emissions: +d.total_emissions_epa
      }
    }).then(d => {
      let grouped = d3.group(d, d => d.fiscalyear);
      setTimelineData(grouped);
    }).catch((error) => console.error("Error loading CSV:", error));
    d3.csv("./data/trips_between_locations_by_school.csv", (d) => {
      return {
          from_full: d.from_full,
          to_full: d.to_full,
          from_lat: +d.from_lat,
          from_lng: +d.from_lng,
          to_lat: +d.to_lat,
          to_lng: +d.to_lng,
          total_trips: +d.total_trips,
          total_emissions: +d.total_emissions,
          fiscalyear: d.fiscalyear.replace("FY20", "FY"),
          school: d.school            
      } as Connection
    }).then((d) => {
        let grouped = d3.group(d, d=>d.fiscalyear)
        setMapData(grouped);
    })
  }, []);
  const [topLine, setTopLine] = useState<TopLineStats | undefined>(undefined);
  useEffect(()=>{
    if (data !== undefined) {
      let topline = {
        emissions: fiscalYearOptions.map(({label,value}) => {
          let yearData = data.get(label)
          if (filters.school === "All JHU") {
            return {year: label, value: d3.sum(yearData, d => d.total_emissions)}
          } else {
            let filtered = yearData.filter(f => f.school === filters.school)
            return {year: label, value: d3.sum(filtered, d => d.total_emissions)}
          }
        }),
        trips: fiscalYearOptions.map(({label,value}) => {
          let yearData = data.get(label)
          if (filters.school === "All JHU") {
            return {year: label, value: d3.sum(yearData, d => d.total_trips)}
          } else {
            let filtered = yearData.filter(f => f.school === filters.school)
            return {year: label, value: d3.sum(filtered, d => d.total_trips)}
          }
        }),
        distance: fiscalYearOptions.map(({label,value}) => {
          let yearData = data.get(label)
          if (filters.school === "All JHU") {
            return {year: label, value: d3.sum(yearData, d => d.total_distance_miles)}
          } else {
            let filtered = yearData.filter(f => f.school === filters.school)
            return {year: label, value: d3.sum(filtered, d => d.total_distance_miles)}
          }
        })
      }
      setTopLine(topline as TopLineStats)
    }
  },[data, filters])

  return (
    <>
      <section className={styles.hero}>
      <h1>Travel Emissions Dashboard</h1>
      <div className={styles.info}>
        <div className={styles.left}>
            <p className={styles.para}>
            This dashboard aims to communicate the climate emissions impact of business travel to faculty and administrative leaders, inform estimates of JHU air travel scope 3 emissions to allow for better decision making, and foster an enabling environment, driven by faculty priorities, for mitigation efforts that address scope 3 emissions.</p>
            <p className={styles.para}>For additional background, please see <a href="https://sustainability.jhu.edu/news/a-climate-dashboard-on-jhu-business-travel-is-scheduled-to-take-off-in-april/">this article</a>.</p>
        </div>
        <div className={styles.right}>
          <p className={styles.para}>This instance of the dashboard is a live public beta.</p>
          <p className={styles.para}>Want to know more about carbon emissions and the role air travel plays on them? </p> 
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
          {schoolOptions?.length > 0 &&
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
        <div className={styles.legend}>
          {!!colorScale &&
            <Legend 
                colorScale={colorScale.domain(filters.years)} 
                school={filters.school}
            />
          }
        </div>
        <div className={styles.kpi1}>
          <Card
            title="Total GHG Emissions"
          >
            <div className={styles.chartContainer} ref={top1ref}>
            {!!topLine && top1ref?.current &&
            <Infographic
              data={topLine.emissions}
              years={filters.years}
              unit={<span>metric tonnes of CO<sub>2</sub>e</span>}
              parentRect={top1ref.current.getBoundingClientRect()}
            />
            }
            </div>
          </Card>
        </div>
        <div className={styles.kpi2}>
          <Card
            title="Total Trips"
          >
            <div className={styles.chartContainer} ref={top2ref}>
            {!!topLine && top2ref?.current &&
            <Infographic
              data={topLine.trips}
              years={filters.years}
              unit="trips taken"
              parentRect={top2ref.current.getBoundingClientRect()}
            />
            }
            </div>
          </Card>
        </div>
        <div className={styles.kpi3}>
          <Card
            title="Total Distance"
          >
            <div className={styles.chartContainer} ref={top3ref}>
            {!!topLine && top3ref?.current &&
            <Infographic
              data={topLine.distance}
              years={filters.years}
              unit="miles"
              parentRect={top3ref.current.getBoundingClientRect()}
              formatString=".4s"
            />
            }
            </div>
          </Card>
        </div>
        <div className={styles.donut}>
          <Card
            title="How complete is our data?"
          >
            <div className={styles.completenessCard}>
              <p>JHU staff book air travel through multiple channels: directly via the Concur system, through third-party agencies, or independently with later reimbursement. This dashboard currently displays data from air travel booked through Concur, World Travel Inc., Safe Harbors Business Travel, and TripLink. We are actively working to assess the completeness of this dataset by cross-referencing bookings with expense reports in Concur, and we will display completeness estimates here soon.</p>
              <p>Additionally, some air travel may not be recorded in Concur at all. According to the JHU Travel and Expense Programs (University Procurement Office), these cases include direct-billed travel agency bookings, estimated to be less than 5% of total travel, and some study abroad program travel, processed through SAP.</p>
            </div>
          </Card>
        </div>
        <div className={styles.method}>
          <Card
            title="How did we calculate the emissions?"
          >
            <div className={styles.completenessCard}>
            <p>The data presented on this dashboard is sourced from Concur’s booking system. In addition to recorded travel details, carbon emissions for each trip have been calculated using the <a href="https://ghgprotocol.org/sites/default/files/standards/Scope3_Calculation_Guidance_0.pdf">GHG Protocol Technical Guidance for Calculating Scope 3 Emissions</a>.</p>
            <p>We applied a distance-based method to estimate emissions, ensuring consistency with established sustainability reporting standards. For a detailed breakdown of our calculation methodology see:</p>
            </div>
            <Button
              text="Our Methodology"
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
            title={`What ${filters.school !== "All JHU" ? `${filters.school} ` : ""}traveler type is traveling the most?`}
          >
            <div className={styles.toggleBox}><span>Trips</span>
            <Toggle 
              checked={toggleStateTraveler === "total_emissions" ? true : false} 
              onChange={handleToggleChangeTraveler} 
            />
            <span>Emissions</span>
            </div>
            <div className={styles.chartContainer} ref={bar1ref}>
              {bar1ref?.current && !loading && !!data &&
                <BarChartVariants 
                  data={filterInternMap(data, yearFilterCallback)}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar1ref.current.getBoundingClientRect()}
                  labelField={"traveler_type" as keyof DataPoint["traveler_type"]}
                  valueField={toggleStateTraveler as keyof DataPoint["total_trips" | "total_emissions"]}
                  school={filters.school}
                  schoolFilter={true}
                  colorScale={colorScale.domain(filters.years)}
                />
              }
            </div>
          </Card>
        </div>
        <div className={styles.bar2}>
          <Card
            title="What school/division is traveling the most?"
          >
            <div className={styles.toggleBox}><span>Trips</span>
            <Toggle 
              checked={toggleStateSchool === "total_emissions" ? true : false} 
              onChange={handleToggleChangeSchool} 
            />
            <span>Emissions</span>
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
                  valueField={toggleStateSchool as keyof DataPoint["total_trips" | "total_emissions"]}
                  school={filters.school}
                  schoolFilter={false}
                  colorScale={colorScale.domain(filters.years)}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.time}>
          <Card title={`When are ${filters.school !== "All JHU" ? `${filters.school} ` : ""}people travelling?`}>
            <div className={cx( styles.chartContainer, styles.lineChart )} ref={timeRef}>
              {!!timelineData && timeRef?.current && !!colorScale &&
                <Timeline 
                  data={filterInternMap(timelineData, yearFilterCallback)}
                  parentRect={timeRef.current.getBoundingClientRect()}
                  colorScale={colorScale.domain(filters.years)}
                  valueField="total_trips"
                  school={filters.school}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.map}>
        <Card title="Where are people travelling?">
          <div className={styles.chartContainer} ref={mapRef}>
            {mapRef?.current && !!mapData &&
              <ConnectionMap
                parentRect={mapRef.current.getBoundingClientRect()} 
                data={filterInternMap(mapData, yearFilterCallback)}
                />
            }
          </div>
        </Card>
      </div>
    </section>
    <div className={styles.feedback}>
      <Button 
        color="primary"
        text="Feedback"
        size="feedback"
        href="https://form.asana.com/?k=4W32Fdf5p7zPNIV-3gKh5A&d=1108016200678557"
      />
    </div>
    </>
  )
}

export default Homepage
