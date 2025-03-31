import styles from "./timeline.module.scss";
import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts"; 
import type { InternMap } from "d3";
import { scaleOrdinal } from "d3";

export default function Timeline({
    data,
    parentRect,
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
}) {
    const colorScale = scaleOrdinal(["#86C8BC", "#E8927C", "#F1C400", "#418FDF", "#000000"])
        .domain(Array.from(data.keys()))
    const [seriesData, setSeriesData] = useState<{label: string, color: string, data: number[]}[]>([])
    useEffect(()=>{
        let serieses = [];
        for (const [y,g] of data.entries()) {
            let series = {
                label: y,
                color: colorScale(y),
                data: g.map(d => d.total_emissions_concur)
            }
            serieses.push(series)
        }
        setSeriesData(serieses);
    },[data])
    return (
        <LineChart 
            xAxis={[{
                scaleType: "point",
                data: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]
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
}