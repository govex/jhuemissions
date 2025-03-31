import { BarChart } from "@mui/x-charts/node/BarChart";
import styles from "./barChart.module.scss";
import { useEffect, useState } from "react";
import type { DataPoint, DataPoint2 } from "~/routes/homePage/homepage";
import { InternMap } from "d3";
import { scaleOrdinal, rollups, sum } from "d3";

type SeriesRolls = {
    year: string;
    rollup: InternMap<string, any[]>
}[];

export default function BarChartVariants({
    data,
    orientation,
    xScale,
    yScale,
    parentRect,
    labelField,
    valueField,
    school
}:{
    data: InternMap<string, DataPoint[] | DataPoint2[]>,
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
    labelField: keyof DataPoint | keyof DataPoint2,
    valueField: keyof DataPoint | keyof DataPoint2,
    school: string,
}) {
    const colorScale = scaleOrdinal(["#86C8BC", "#E8927C", "#F1C400", "#418FDF", "#000000"])
        .domain(Array.from(data.keys()))
    const [rolled, setRolled] = useState<SeriesRolls | undefined>(undefined);
    useEffect(() => {
        let seriesRolls = []
        for (const [y,g] of data.entries()) {
            let rolled = rollups(g, v => sum(v, d => d[valueField]), d => d[labelField]);
            seriesRolls.push({
                year: y,
                rollup: rolled.sort((a,b)=>b[1]-a[1])
            })
        }
        setRolled(seriesRolls as SeriesRolls);
    },[data, labelField, valueField])
    const [groupLabels, setGroupLabels] = useState<string[] | []>([]);
    const [marginLeft, setMarginLeft] = useState(0);
    const [maxVal, setMaxVal] = useState(0)
    useEffect(() => {
        if (rolled !== undefined) {
            let maxLength = 0;
            let maxVal = 0;
            let labels = new Set();
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
            setMarginLeft(maxLength * 10);
            setGroupLabels(Array.from(labels));
        }
    }, [rolled])
    const [seriesData, setSeriesData] = useState<{label: string, color: string, data: number[]}[]>([])
    useEffect(()=>{
        if (rolled !== undefined) {
            let serieses = [];
            for (const roll of rolled) {
                let series = {
                    label: roll.year,
                    color: colorScale(roll.year),
                    data: roll.rollup.map(d => valueField === "percapita_trips" || valueField === "percapita_emissions" ? (d[1]*1000).toFixed(2) : d[1])
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
            groupLabels.length > 0
        ) {
            setRender(true);
        }
    },[marginLeft, seriesData, maxVal, groupLabels])
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
            <BarChart className={styles.bar11}
            margin={{left: marginLeft, right: 70}}
            layout={orientation}
            yAxis={[{ 
                scaleType: yScale,
                data: groupLabels      
            }]}
            xAxis={[{ scaleType: xScale, 
                disableTicks: true,
                label: valueField === "percapita_trips" || valueField === "percapita_emissions" 
                    ? "trips per 1,000 people"
                    : "# of trips"
            }]}
            series={seriesData}
            width={parentRect?.width}
            height={parentRect?.height}
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
            barLabel="value"
            slotProps={{
                legend: {
                    labelStyle: {
                        fontFamily: "Montserrat",
                        fontWeight: 600,
                        fontSize: 20
                    }
                }
            }}
            />
        )    
    } else {
        return null
    }
}
