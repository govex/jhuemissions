
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
import type { Route } from "./+types/homepage";
import BarChartVariants from "~/components/barChart/barChart";
import ConnectionMap from "~/components/connectionMap/connectionMap";
import Toggle from "~/components/toggle/toggle";
import {toTitleCase, formatPlaces} from "~/utils/titleCase";
import supabase from "~/utils/supabase";
import Timeline from "~/components/timeline/timeline";
import Legend from "~/components/legend/legend";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "JHU Travel Emissions Dashboard" },
    { name: "JHU Travel Emissions Dashboard", content: "Welcome to the JHU Travel Emissions Dashboard!" },
  ];
}
export async function loader({}: Route.LoaderArgs) {
  let places = await supabase.from('places').select();
  let schools = await supabase.from('business_area').select();
  let map = await supabase.from('map').select();
  let bookings = await supabase.from('bookings').select();
  let timeline = await supabase.from('timeline').select();
  let filters = {school: "All JHU", years:["FY23-24"]};
  const fiscalYearOptions = [
    {label: "FY23-24", value: "FY23-24", order: 7},
    {label: "FY22-23", value: "FY22-23", order: 6},
    {label: "FY21-22", value: "FY21-22", order: 5},
    {label: "FY20-21", value: "FY20-21", order: 4},
    {label: "FY19-20", value: "FY19-20", order: 3},
    {label: "FY18-19", value: "FY18-19", order: 2},
    {label: "FY17-18", value: "FY17-18", order: 1}
  ]
  let topline_jhu = await supabase.from('alljhutopline').select();
  let topline_school = await supabase.from('school_topline').select();
  let traveler_jhu = await supabase.from('traveler_topline').select();
  let map_jhu = await supabase.from('map_alljhu').select();
  let timeline_jhu = await supabase.from('timeline_alljhu').select();
  return {
    places: places.data,
    schools: schools.data,
    map: {school: map.data, jhu: map_jhu.data},
    timeline: {school: timeline.data, jhu: timeline_jhu.data},
    bookings: {school: topline_school.data, traveler_jhu: traveler_jhu.data, traveler_school: bookings.data, topline: topline_jhu.data }, 
    filters,
    fiscalYearOptions
  }
}
type errorText = "Only five years may be displayed at once" | "At least one year must be selected." | undefined;
function Homepage({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  const colorScale = d3.scaleOrdinal(["#86C8BC", "#E8927C", "#F1C400", "#418FDF", "#000000"]);
  const [schoolData, setSchoolData] = useState<any>(loaderData.bookings.school);
  const [travelerData, setTravelerData] = useState<any>(loaderData.bookings.traveler_jhu);
  const [timelineData, setTimelineData] = useState<any>(loaderData.timeline.jhu);
  const [mapData, setMapData] = useState<any>(loaderData.map.jhu);
  const [topLineData, setTopLineData] = useState<any>(loaderData.bookings.topline);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [toggleStateTimeline, setToggleStateTimeline] = useState<"emissions" | "trips">("trips");
  const [toggleStateTraveler, setToggleStateTraveler] = useState<"emissions" | "trips" >("trips");
  const [toggleStateSchool, setToggleStateSchool] = useState<"emissions" | "trips">("trips");
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
      setToggleStateTraveler("emissions")
    } else {
      setToggleStateTraveler("trips")
    }
  }  
  const handleToggleChangeSchool = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setToggleStateSchool("emissions")
    } else {
      setToggleStateSchool("trips")
    }
  }  
  const handleToggleChangeTimeline = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setToggleStateTimeline("emissions")
    } else {
      setToggleStateTimeline("trips")
    }
  }  
  const [fiscalYearOptions, setFiscalYearOptions] = useState<any>(loaderData.fiscalYearOptions)
  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popover' : undefined;
  const [filters, setFilters] = useState<any>(loaderData.filters);
  const [filterError, setFilterError] = useState<errorText>(undefined); 
  const handleFilters = (event: SyntheticEvent, value: string, reason: AutocompleteChangeReason) => {
    console.log(event, value, reason)
    if (reason) {
      setFilters({...filters, school: value ? value : 'All JHU'})
    } else if (event.target.checked === false) {
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
          checked.push(event.target.value);
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
    }
  }
  useEffect(() => {
    if (filters.school === "All JHU") {
      setTopLineData(loaderData.bookings.topline)
      setTravelerData(loaderData.bookings.traveler_jhu)
      setMapData(loaderData.map.jhu)
      setTimelineData(loaderData.timeline.jhu)
    } else {
      let schoolBookings = loaderData.bookings.school?.filter(f => toTitleCase(f.school) === filters.school);
      setTopLineData(schoolBookings ? schoolBookings : []);
      // let schoolTravelers = loaderData.bookings.traveler_school?.filter(f => toTitleCase(f.school) === filters.school);
      setTravelerData(loaderData.bookings.traveler_school ? loaderData.bookings.traveler_school : []);
      let schoolCode = loaderData.schools?.find(f => toTitleCase(f.employeeGroupName) === filters.school);
      let schoolMap = schoolCode ? loaderData.map.school?.filter(f => f.school === schoolCode.code) : undefined;
      setMapData(schoolMap ? schoolMap : []);
      let schoolTimeline = loaderData.timeline.school?.filter(f => toTitleCase(f.school) === filters.school);
      setTimelineData(schoolTimeline ? schoolTimeline : [])
    }
  }, [filters.school, loaderData.bookings, loaderData.map, loaderData.timeline])
  const [schoolOptions, setSchoolOptions] = useState<{label: string, value: string, code: number}[] | undefined>(undefined)
  useEffect(()=>{
    if (loaderData.schools && schoolData.length > 0) {
      let bookingsSchools = schoolData.map(m => m.school)
      let schools = loaderData.schools.filter(f => {
        return bookingsSchools.includes(f.employeeGroupName)
      }).map(m => {
        return {
          label: toTitleCase(m.employeeGroupName),
          value: m.employeeGroupName,
          code: m.code
        }
      })
      setSchoolOptions(schools.sort((a,b)=>a.label.localeCompare(b.label)))
    }
  },[loaderData.schools, schoolData])
console.log(filters)
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
          {schoolOptions &&
          <>
          <Popover
            id={filterId}
            disableScrollLock
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
            {!!topLineData && top1ref?.current &&
            <Infographic
              valueField="emissions"
              data={topLineData}
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
            {!!topLineData && top2ref?.current &&
            <Infographic
              valueField="trips"
              data={topLineData}
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
            {!!topLineData && top3ref?.current &&
            <Infographic
              valueField="distance"
              data={topLineData}
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
              checked={toggleStateTraveler === "emissions"} 
              onChange={handleToggleChangeTraveler} 
            />
            <span>Emissions</span>
            </div>
            <div className={styles.chartContainer} ref={bar1ref}>
              {bar1ref?.current && !!travelerData &&
                <BarChartVariants 
                  data={travelerData}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar1ref.current.getBoundingClientRect()}
                  labelField={"traveler_type"}
                  valueField={toggleStateTraveler}
                  school={filters.school}
                  schoolOptions={schoolOptions}
                  colorScale={colorScale.domain(filters.years)}
                  years={filters.years}
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
              checked={toggleStateSchool === "emissions"} 
              onChange={handleToggleChangeSchool} 
            />
            <span>Emissions</span>
            </div>
            <div className={styles.chartContainer} ref={bar2ref}>
              {bar2ref?.current && !!schoolData && !!schoolOptions &&
                <BarChartVariants 
                  data={schoolData}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar2ref.current.getBoundingClientRect()}
                  labelField={"school"}
                  valueField={toggleStateSchool}
                  school={filters.school}
                  schoolOptions={schoolOptions}
                  colorScale={colorScale.domain(filters.years)}
                  years={filters.years}
                  schoolFilter={false}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.time}>
          <Card title={`When are ${filters.school !== "All JHU" ? `${filters.school} ` : ""}people travelling?`}>
          <div className={styles.toggleBox}><span>Trips</span>
            <Toggle 
              checked={toggleStateTimeline === "emissions" ? true : false} 
              onChange={handleToggleChangeTimeline} 
            />
            <span>Emissions</span>
            </div>
            <div className={cx( styles.chartContainer, styles.lineChart )} ref={timeRef}>
              {!!timelineData && timeRef?.current && !!colorScale &&
                <Timeline 
                  data={timelineData.filter(f => filters.years.includes(f.fiscalyear))}
                  parentRect={timeRef.current.getBoundingClientRect()}
                  colorScale={colorScale.domain(filters.years)}
                  valueField={toggleStateTimeline}
                  years={filters.years}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.map}>
        <Card title={`Where are ${filters.school !== "All JHU" ? `${filters.school} ` : ""}people travelling?`}>
          <div className={styles.chartContainer} ref={mapRef}>
            {mapRef?.current && !!mapData && !!loaderData.places && 
              <ConnectionMap
                parentRect={mapRef.current.getBoundingClientRect()} 
                data={mapData.filter(f => filters.years.includes(f.fiscalyear))}
                places={loaderData.places}
                colorScale={colorScale.domain(filters.years)}
                years={filters.years}
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
