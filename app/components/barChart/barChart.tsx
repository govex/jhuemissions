import pkg from "@mui/x-charts/BarChart/index.js";
import styles from "./barChart.module.scss";
import { useEffect, useState, type ReactNode } from "react";
import type { DataPoint } from "~/routes/homePage/homepage";
import type { InternMap } from "d3";
import { schemeCategory10, scaleOrdinal } from "d3";
  
export default function BarChartVariants({
    data,
    orientation,
    xScale,
    yScale,
    parentRect,
    labelField,
    valueField,
    year = ["FY202425"]
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
    year: string[],
}) {
    const { BarChart } = pkg;
    const colorScale = scaleOrdinal(schemeCategory10).domain(["FY202425", "FY202324", "FY202223", "FY202122","FY202021"])
    const [groupLabels, setGroupLabels] = useState<string[] | []>([]);
    const [marginLeft, setMarginLeft] = useState(0);
    useEffect(() => {
        if (data !== undefined) {
            if (year.length === 1) {
                let labelMap = data.get(year[0]).map((item) => item[labelField]);
                console.log(labelMap)
                setGroupLabels(labelMap);
                setMarginLeft(Math.max(...labelMap.map(d => d.length * 10)));
            } else {
                let maxLength = 0;
                let labels = new Set();
                for (const g of data.values()) {
                    g.forEach(i => {
                        if (i[labelField].length > maxLength) {
                            maxLength = i[labelField].length
                        }
                        labels.add(i[labelField]);
                    })
                }
                setMarginLeft(maxLength * 8);
                setGroupLabels(Array.from(labels));
            }
        }
    }, [data, labelField, year])
    const [maxVal, setMaxVal] = useState(0)
    useEffect(() => {
        if (data !== undefined) {
            if (year.length === 1) {
                setMaxVal(Math.max(...data.get(year[0]).map((item) => item[valueField])))
            } else {
                let max = 0;
                for (const g of data.values()) {
                    g.forEach(i => {
                        if (i[valueField] > max) {
                            max = i[valueField]
                        }    
                    })
                }
                setMaxVal(max)
            }
        }
    },[data, year, valueField])
    const [seriesData, setSeriesData] = useState<{label: string, color: string, data: number[]}[]>([])
    useEffect(()=>{
        let serieses = [];
        for (const [y,g] of data.entries()) {
            let series = {
                label: y,
                color: colorScale(y),
                data: g.map(d => d[valueField])
            }
            serieses.push(series)
        }
        setSeriesData(serieses);
    },[data, valueField])
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
                data: [0, maxVal], 
                disableTicks: true,
            }]}
            series={seriesData}
            width={parentRect?.width}
            height={parentRect?.height}
            bottomAxis={null}
            sx={{
                // Customize x-axis line (grey, thick)
                "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                    stroke: "#CCC",
                    strokeWidth: 4,
                    color: "#000",
                },
                "& .MuiBarLabel-root": {
                    textAnchor: "start"
                }
            }}
            // slots={{barLabel: newBarLabel}}
            barLabel="value"
            />
        )    
    } else {
        return null
    }
}
