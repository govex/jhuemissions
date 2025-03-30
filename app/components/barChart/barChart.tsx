import { BarChart } from "@mui/x-charts/node/BarChart";
import styles from "./barChart.module.scss";
import { useEffect, useState } from "react";
import type { DataPoint, DataPoint2 } from "~/routes/homePage/homepage";
import type { InternMap } from "d3";
import { scaleOrdinal } from "d3";
  
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
    const [groupLabels, setGroupLabels] = useState<string[] | []>([]);
    const [marginLeft, setMarginLeft] = useState(0);
    useEffect(() => {
        if (data !== undefined) {
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
            setMarginLeft(maxLength * 10);
            setGroupLabels(Array.from(labels));
        }
    }, [data, labelField])
    const [maxVal, setMaxVal] = useState(0)
    useEffect(() => {
        if (data !== undefined) {
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
    },[data, valueField])
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
