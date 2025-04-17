import { BarChart } from "@mui/x-charts/node/BarChart";
import styles from "./barChart.module.scss";
import cx from "classnames";
import { type FC, useState, useEffect } from "react";
import type { DataPoint } from "~/routes/homePage/homepage";
import type { InternMap, ScaleOrdinal } from "d3";
import { rollups, sum, format, max } from "d3";

type ColorScale = ScaleOrdinal<string, string>;

type SeriesRolls = {
    year: string;
    rollup: [string, number][]
}[];

type Stacked = InternMap<string, InternMap<string, {total_trips: number, total_emissions: number}>>

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
    colorScale,
    stack = false,
    topLine,
    years
}:{
    data: InternMap<string, DataPoint[] | InternMap<string, {total_trips: number, total_emissions: number}>>,
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
    stack?: Boolean,
    topLine?: any[]
    years?: any
}) {
    const [rolled, setRolled] = useState<SeriesRolls | Stacked | undefined>(undefined);
    useEffect(() => {
        if (stack && years) {
            setRolled(data)
        } else {
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
        }
    },[data, labelField, valueField, school])
    const [groupLabels, setGroupLabels] = useState<string[] | []>([]);
    const [overflowScroll, setOverflowScroll] = useState<Boolean>(false);
    const [marginLeft, setMarginLeft] = useState(0);
    const [maxVal, setMaxVal] = useState(0)
    useEffect(() => {
        if (rolled !== undefined && !stack) {
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
            setMarginLeft(stack ? 70 : maxLength * 7);
            setGroupLabels(Array.from(labels));
        }
    }, [rolled, stack])
    const [realHeight, setRealHeight] = useState(parentRect.height)
    useEffect(()=>{
        if (groupLabels?.length > 15 && !stack) {
            setRealHeight(groupLabels.length * 42)            
            setOverflowScroll(true)
        } else {
            setRealHeight(parentRect.height)
            setOverflowScroll(false)
        }
    },[groupLabels, parentRect.height])
    const [seriesData, setSeriesData] = useState<{
        label: string, 
        color?: string, 
        stack?: string, 
        valueFormatter?: (v: number, { dataIndex }: { dataIndex: any; }) => string, 
        data: number[]
    }[]>([])
    useEffect(()=>{
        if (rolled !== undefined) {
            if (stack && topLine && years) {
                let serieses = [];
                for (const [group, yearMap] of rolled.entries()) {
                    let series = {
                        label: group,
                        stack: "total",
                        data: years.map(year => {
                            let yearData = yearMap.get(year)
                            return yearData ? yearData[valueField] : 0
                        }),
                        highlightScope: {
                            highlight: 'series',
                            fade: "global"
                        },
                        valueFormatter: (v:number, { dataIndex }: { dataIndex: any; }) => {
                            let yearValues = topLine.find(f => f.year === years[dataIndex])
                            let yearAll = valueField === "total_trips" ? yearValues.trips.all : yearValues.emissions.all
                            return format(".3%")(v / yearAll)
                        }
                    }
                    serieses.push(series)
                }
                const maxStackedValue = max(serieses.flatMap(f => f.data.map(m => m)))
                setMaxVal(maxStackedValue)
                const modifiedSeries = [{ ...serieses[0], stackOffset: "expand", stackOrder: "ascending" }, ...serieses.slice(1)];
                setSeriesData(modifiedSeries)
            } else {
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
        }
    },[rolled, stack, topLine, years])
    const [render, setRender] = useState(false);
    useEffect(()=>{
        if (seriesData.length > 0 &&
            !!realHeight &&
            maxVal > 0 &&
            stack &&
            years
        ) {
            setRender(true);
        } else if (
            marginLeft > 0 &&
            seriesData.length > 0 &&
            maxVal > 0 &&
            groupLabels.length > 0 &&
            !!realHeight
        ) {
            setRender(true);
        } else {
            setRender(false);
        }
    },[marginLeft, seriesData, maxVal, groupLabels, realHeight])
    if (render) {
        return (
            <div className={cx(styles.base, overflowScroll ? styles.overflowscroll : "")}>
            <BarChart className={styles.bar11}
            margin={{left: stack ? 70 : marginLeft, right: 50}}
            layout={orientation}
            yAxis={[{ 
                scaleType: yScale,
                data: stack ? years : groupLabels      
            }]}
            xAxis={[{ id: "mainX", 
                scaleType: xScale, 
                disableTicks: true,
                label: valueField === "total_trips"
                    ? `${stack ? "%" : "#"} of trips`
                    : `${stack ? "% " : ""}MTCO2e`,
                colorMap: stack ? {
                    type: "continuous",
                    min: 0,
                    max: maxVal,
                    color: ["#ECECEC","#A15B96"]
                } : undefined,
            }]}
            axisHighlight={{y: "none"}}
            bottomAxis={stack ? null : {}}
            topAxis={stack || !overflowScroll ? undefined : "mainX"}
            leftAxis={{disableLine: stack, disableTicks: stack}}
            tooltip={{trigger: stack ? "item" : "axis"}}
            series={seriesData}
            width={parentRect?.width}
            height={realHeight}
            sx={{
                "& .MuiBarLabel-root": {
                    textAnchor: "start"
                }
            }}
            slotProps={{
                legend: {
                    hidden: stack,
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
