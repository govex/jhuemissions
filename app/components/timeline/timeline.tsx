import styles from "./timeline.module.scss";
import { type FC, useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts"; 
import type { InternMap, ScaleOrdinal } from "d3";
import { rollups, sum } from "d3";

type ColorScale = ScaleOrdinal<string, string>;

export default function Timeline<FC>({
    data,
    parentRect,
    colorScale,
    school,
    valueField
}:{
    data: InternMap<string, any[]>,
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
    colorScale: ColorScale,
    school: string,
    valueField: string
}) {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const [seriesData, setSeriesData] = useState<{label: string, color: string, data: number[]}[] | []>([])
    useEffect(()=>{
        let serieses = [];
        for (const [y,g] of data.entries()) {
            if (!school || school === "All JHU") {
                let rolled = rollups(g, v => sum(v, d => d[valueField]), d => d.month);
                let series = {
                    label: y,
                    color: colorScale(y),
                    data: rolled.sort((a,b)=>months.indexOf(a[0])-months.indexOf(b[0])).map(d => d[1])
                }
                serieses.push(series)
            } else {
                let filtered = g.filter(d => d.school === school)
                let series = {
                    label: y,
                    color: colorScale(y),
                    data: filtered.sort((a,b)=>months.indexOf(a.month)-months.indexOf(b.month)).map(d => d[valueField])
                }
                serieses.push(series)
            }
        }
        setSeriesData(serieses);
    },[data])
    if (seriesData.length > 0) {
        return (
            <LineChart 
                xAxis={[{
                    scaleType: "point",
                    data: months
                }]}
                yAxis={[{
                    label: "# of trips",
                }]}
                series={seriesData}
                width={parentRect.width}
                height={parentRect.height}
                margin={{left:80}}
                sx={{
                    "& .MuiChartsAxis-directionY": {
                        "& .MuiChartsAxis-label": {
                            transform: "translateX(-30px) !important"
                          }    
                    }
                
                }}
            />
        )    
    } else {
        return (
            <p>working on it</p>
        )
    }
}