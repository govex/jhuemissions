import { BarChart } from "@mui/x-charts/node/BarChart";
import styles from "./barChart.module.scss";
import cx from "classnames";
import { type FC, useState, useEffect } from "react";
import type { DataPoint } from "~/routes/homePage/homepage";
import type { InternMap, ScaleOrdinal } from "d3";
import { rollups, sum } from "d3";

type ColorScale = ScaleOrdinal<string, string>;

type SeriesRolls = {
    year: string;
    rollup: [string, number][]
}[];

export default function BarChartVariants<FC>({
    data,
    orientation,
    xScale,
    yScale,
    parentRect,
    labelField,
    valueField,
    school,
    schoolFilter,
    colorScale
}:{
    data: InternMap<string, DataPoint[]>,
    orientation: "horizontal" | "vertical" | undefined,
    xScale: "band" | "point" | "log" | "pow" | "sqrt" | "time" | "utc" | "linear" | undefined,
    yScale: "band" | "point" | "log" | "pow" | "sqrt" | "time" | "utc" | "linear" | undefined,
    parentRect: {
        bottom: number,
        height: number,
        left: number,
        right: number,
        top: number,
        width: number,
        x: number,
        y: number
    },
    labelField: keyof DataPoint,
    valueField: keyof DataPoint,
    school: string,
    schoolFilter: Boolean,
    colorScale: ColorScale,
}) {
    const [rolled, setRolled] = useState<SeriesRolls | undefined>(undefined);
    useEffect(() => {
        let seriesRolls = []
        for (const [y,g] of data.entries()) {
            if (school !== "All JHU" && schoolFilter) {
                let filtered = g.filter(f => f.school === school)
                let rolled = rollups(filtered, v => sum(v, d => d[valueField]), d => d[labelField]);
                seriesRolls.push({
                    year: y,
                    rollup: rolled.sort((a,b)=>b[1]-a[1])
                })
            } else if (school !== "All JHU") {    
                let rolled = rollups(g, v => sum(v, d => d[valueField]), d => d[labelField]);
                let sorted = rolled.sort((a,b)=>b[1]-a[1])
                let schoolIdx = sorted.findIndex(f => f[0] === school);
                let spliced = sorted.splice(schoolIdx, 1);
                let reordered = [spliced[0], ...sorted];

                seriesRolls.push({
                    year: y,
                    rollup: reordered
                })    
            } else {
                let rolled = rollups(g, v => sum(v, d => d[valueField]), d => d[labelField]);
                seriesRolls.push({
                    year: y,
                    rollup: rolled.sort((a,b)=>b[1]-a[1])
                })    
            }
        }
        setRolled(seriesRolls as SeriesRolls);
    },[data, labelField, valueField, school])
    const [groupLabels, setGroupLabels] = useState<string[] | []>([]);
    const [overflowScroll, setOverflowScroll] = useState<Boolean>(false);
    const [marginLeft, setMarginLeft] = useState(0);
    const [maxVal, setMaxVal] = useState(0)
    useEffect(() => {
        if (rolled !== undefined) {
            let maxLength = 0;
            let maxVal = 0;
            let labels = new Set<string>();
            for (const g of rolled.values()) {
                g.rollup.forEach(i => {
                    if (i[0].length > maxLength) {
                        maxLength = i[0].length
                    }
                    if (i[1] > maxVal) {
                        maxVal = i[1]
                    }    
                    labels.add(i[0]);
                })
            }
            setMaxVal(maxVal)
            setMarginLeft(maxLength * 7);
            setGroupLabels(Array.from(labels));
        }
    }, [rolled])
    const [realHeight, setRealHeight] = useState(parentRect.height)
    useEffect(()=>{
        if (groupLabels?.length > 15) {
            setRealHeight(groupLabels.length * 42)            
            setOverflowScroll(true)
        } else {
            setRealHeight(parentRect.height)
            setOverflowScroll(false)
        }
    },[groupLabels, parentRect.height])
    const [seriesData, setSeriesData] = useState<{label: string, color: string, data: number[]}[]>([])
    useEffect(()=>{
        if (rolled !== undefined) {
            let serieses = [];
            for (const roll of rolled) {
                let series = {
                    label: roll.year,
                    color: colorScale(roll.year),
                    data: roll.rollup.map(d => valueField === "percapita_trips" || valueField === "percapita_emissions" ? (d[1]).toFixed(5) : d[1])
                }
                serieses.push(series)
            }
            setSeriesData(serieses);
        }
    },[rolled])
    const [render, setRender] = useState(false);
    useEffect(()=>{
        if (
            marginLeft > 0 &&
            seriesData.length > 0 &&
            maxVal > 0 &&
            groupLabels.length > 0 &&
            !!realHeight
        ) {
            setRender(true);
        }
    },[marginLeft, seriesData, maxVal, groupLabels, realHeight])
    // const barClasses = getBarLabelUtilityClass("barLabel")
    // console.log(barClasses);
    // const BarLabelComponent = (x:BarLabelProps) => {
    //     return (
    //         <BarLabel {...x}></BarLabel>
    //     )
    // }
    // const newBarLabel:ReactNode<BarLabelProps> = BarLabelComponent;
    if (render) {
        return (
            <div className={cx(styles.base, overflowScroll ? styles.overflowscroll : "")}>
            <BarChart className={styles.bar11}
            margin={{left: marginLeft, right: 70}}
            layout={orientation}
            yAxis={[{ 
                scaleType: yScale,
                data: groupLabels      
            }]}
            xAxis={[{ scaleType: xScale, 
                position: "top",
                disableTicks: true,
                label: valueField === "total_trips"
                    ? "# of trips"
                    : "MTCO2e"
            }]}
            series={seriesData}
            width={parentRect?.width}
            height={realHeight}
            sx={{
                // Customize x-axis line (grey, thick)
                // "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                //     stroke: "#CCC",
                //     strokeWidth: 4,
                //     color: "#000",
                // },
                "& .MuiBarLabel-root": {
                    textAnchor: "start"
                }
            }}
            // slots={{barLabel: newBarLabel}}
            slotProps={{
                legend: {
                    labelStyle: {
                        fontFamily: "gentona",
                        fontWeight: 600,
                        fontSize: 20
                    }
                }
            }}
            />
            </div>
        )    
    } else {
        return null
    }
}
