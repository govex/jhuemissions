
import styles from "./dashboard.module.scss";
import cx from "classnames";
import { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router";
import type { ChangeEvent, MouseEvent, SyntheticEvent } from "react";
import { withAuthenticationRequired } from "react-oidc-context";
import Button from "~/components/button/button";
import Card from "~/components/card/card";
import { Popover, type AutocompleteChangeReason } from "@mui/material";
import Filter from "~/components/filter/Filter";
import Form from "~/components/form/Form";
import Infographic from "~/components/infographic/infographic";
import * as d3 from "d3";
import type { Route } from "./+types/dashboard";
import BarChartVariants from "~/components/barChart/barChart";
import ConnectionMap from "~/components/connectionMap/connectionMap";
import Toggle from "~/components/toggle/toggle";
import {toTitleCase} from "~/utils/stringFunctions";
import useResizeObserver from "~/utils/useResizeObserver";
import Timeline from "~/components/timeline/timeline";
import Legend from "~/components/legend/legend";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "JHU Travel Emissions Dashboard" },
    { name: "JHU Travel Emissions Dashboard", content: "Welcome to the JHU Travel Emissions Dashboard!" },
  ];
}
type errorText = "Only five years may be displayed at once" | "At least one year must be selected." | undefined;
function Dashboard({}: Route.ComponentProps) {
  const rootData = useRouteLoaderData("root");
  const colorScale = d3.scaleOrdinal(["#86c8bc", "#af6e5d", "#f2c80f", "#884c7e", "#3b81ca"]);
  const [schoolData, setSchoolData] = useState<any>(rootData.bookings.school);
  const [travelerData, setTravelerData] = useState<any>(rootData.bookings.traveler_jhu);
  const [timelineData, setTimelineData] = useState<any>(rootData.timeline.jhu);
  const [percentData, setPercentData] = useState<any>(rootData.percent.school);
  const [mapData, setMapData] = useState<any>(rootData.map.jhu);
  const [topLineData, setTopLineData] = useState<any>(rootData.bookings.topline);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [toggleStateTimeline, setToggleStateTimeline] = useState<"emissions" | "trips">("trips");
  const [toggleStateTraveler, setToggleStateTraveler] = useState<"emissions" | "trips" >("trips");
  const [toggleStateSchool, setToggleStateSchool] = useState<"emissions" | "trips">("trips");
  const [toggleStatePercentField, setToggleStatePercentField] = useState<"pct_emissions" | "pct_trips">("pct_emissions");
  const [toggleStatePercentDataset, setToggleStatePercentDataset] = useState<"school" | "traveler_type">("school");
  const [top1ref, top1rect] = useResizeObserver();
  const [top2ref, top2rect] = useResizeObserver();
  const [top3ref, top3rect] = useResizeObserver();
  const [bar1ref, bar1rect] = useResizeObserver();
  const [bar2ref, bar2rect] = useResizeObserver();
  const [mapRef, mapRect] = useResizeObserver();
  const [timeRef, timeRect] = useResizeObserver();
  const [percentRef, percentRect] = useResizeObserver();
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
  const handleToggleChangePercentField = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setToggleStatePercentField("pct_emissions")
    } else {
      setToggleStatePercentField("pct_trips")
    }
  }  
  const handleToggleChangePercentDataset = (event:ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setToggleStatePercentDataset("traveler_type")
      setPercentData(rootData.percent.traveler)
    } else {
      setToggleStatePercentDataset("school")
      setPercentData(rootData.percent.school)
    }
  }  
  const [fiscalYearOptions, setFiscalYearOptions] = useState<any>(rootData.fiscalYearOptions)
  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popover' : undefined;
  const [filters, setFilters] = useState<any>(rootData.filters);
  const [filterError, setFilterError] = useState<errorText>(undefined); 
  const handleFilters = (event: SyntheticEvent, value: string, reason: AutocompleteChangeReason) => {
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
      setTopLineData(rootData.bookings.topline)
      setTravelerData(rootData.bookings.traveler_jhu)
      setMapData(rootData.map.jhu)
      setTimelineData(rootData.timeline.jhu)
    } else {
      let schoolBookings = rootData.bookings.school?.filter(f => toTitleCase(f.school) === filters.school);
      setTopLineData(schoolBookings ? schoolBookings : []);
      setTravelerData(rootData.bookings.traveler_school ? rootData.bookings.traveler_school : []);
      let schoolCode = rootData.schools?.find(f => toTitleCase(f.employeeGroupName) === filters.school);
      let schoolMap = schoolCode ? rootData.map.school?.filter(f => f.school === schoolCode.code) : undefined;
      setMapData(schoolMap ? schoolMap : []);
      let schoolTimeline = rootData.timeline.school?.filter(f => toTitleCase(f.school) === filters.school);
      setTimelineData(schoolTimeline ? schoolTimeline : [])
    }
  }, [filters.school, rootData.bookings, rootData.map, rootData.timeline])
  const [schoolOptions, setSchoolOptions] = useState<{label: string, value: string, code: number}[] | undefined>(undefined)
  useEffect(()=>{
    if (rootData.schools && schoolData.length > 0) {
      let bookingsSchools = schoolData.map(m => m.school)
      let schools = rootData.schools.filter(f => {
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
  },[rootData.schools, schoolData])
  return (
    <>
      <section className={styles.hero}>
      <h1>Travel Emissions Dashboard</h1>
      <div className={styles.info}>
          <p className={styles.para}>Want to know more about carbon emissions and the role air travel plays on them? </p> 
          <Button
            type="border"
            icon="right-arrow"
            text="Go to the About Section"
            color="secondary"
            size="large"
            href="/"
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
            {!!topLineData && !!top1rect &&
            <Infographic
              valueField="emissions"
              data={topLineData}
              years={filters.years}
              unit={<span>metric tons of CO<sub>2</sub>e</span>}
              parentRect={top1rect}
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
            {!!topLineData && !!top2rect &&
            <Infographic
              valueField="trips"
              data={topLineData}
              years={filters.years}
              unit="trips taken"
              parentRect={top2rect}
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
            {!!topLineData && !!top3rect &&
            <Infographic
              valueField="distance"
              data={topLineData}
              years={filters.years}
              unit="miles"
              parentRect={top3rect}
              formatString=".4s"
            />
            }
            </div>
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
              {!!bar1rect && !!travelerData &&
                <BarChartVariants 
                  data={travelerData}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar1rect}
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
              {!!bar2rect && !!schoolData && !!schoolOptions &&
                <BarChartVariants 
                  data={schoolData}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={bar2rect}
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
          <Card title={`When are ${filters.school !== "All JHU" ? `${filters.school} ` : ""}people traveling?`}>
          <div className={styles.toggleBox}><span>Trips</span>
            <Toggle 
              checked={toggleStateTimeline === "emissions" ? true : false} 
              onChange={handleToggleChangeTimeline} 
            />
            <span>Emissions</span>
            </div>
            <div className={cx( styles.chartContainer, styles.lineChart )} ref={timeRef}>
              {!!timelineData && !!timeRect && !!colorScale &&
                <Timeline 
                  data={timelineData.filter(f => filters.years.includes(f.fiscalyear))}
                  parentRect={timeRect}
                  colorScale={colorScale.domain(filters.years)}
                  valueField={toggleStateTimeline}
                  years={filters.years}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.map}>
        <Card title={`Where are ${filters.school !== "All JHU" ? `${filters.school} ` : ""}people traveling?`}>
          <div className={styles.chartContainer} ref={mapRef}>
            {!!mapRect && !!mapData && !!rootData.places && 
              <ConnectionMap
                parentRect={mapRect} 
                data={mapData.filter(f => filters.years.includes(f.fiscalyear))}
                places={rootData.places}
                colorScale={colorScale.domain(filters.years)}
                years={filters.years}
                />
            }
          </div>
        </Card>
      </div>
      <div className={styles.percent}>
          <Card
            title="How is travel distributed across all of JHU?"
          >
            <div className={styles.multitoggle}>
              <div className={styles.toggleBox}>
                <span>School</span>
                <Toggle 
                  checked={toggleStatePercentDataset === "traveler_type"} 
                  onChange={handleToggleChangePercentDataset} 
                />
                <span>Traveler</span>
              </div>
              <div className={styles.toggleBox}>
                <span>Trips</span>
                <Toggle 
                  checked={toggleStatePercentField === "pct_emissions"} 
                  onChange={handleToggleChangePercentField} 
                />
                <span>Emissions</span>
              </div>
            </div>
            <div className={styles.chartContainer} ref={percentRef}>
              {!!percentRect && !!percentData && !!schoolOptions &&
                <BarChartVariants 
                  data={percentData}
                  orientation="horizontal"
                  xScale="linear"
                  yScale="band"
                  parentRect={percentRect}
                  labelField={toggleStatePercentDataset}
                  valueField={toggleStatePercentField}
                  school={filters.school}
                  schoolOptions={schoolOptions}
                  colorScale={colorScale.domain(filters.years)}
                  years={filters.years}
                  schoolFilter={false}
                  stack={true}
                />
              }
            </div>
          </Card>
      </div>
      <div className={styles.tool}>
        <Card title="Emissions Calculator">
          {!!rootData.airports && rootData.airports.length > 0 &&
            <Form airports={rootData.airports} />
          }
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
      </section>      
    <div className={styles.feedback}>
      <Button 
        color="primary"
        text="Feedback"
        size="feedback"
        type="solid"
        href="https://form.asana.com/?k=4W32Fdf5p7zPNIV-3gKh5A&d=1108016200678557"
      />
    </div>
    </>
  )
}
export default import.meta.env.Dev ? Dashboard : withAuthenticationRequired(Dashboard);