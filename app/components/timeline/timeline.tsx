import styles from "./timeline.module.scss";
import { type FC, useState, useEffect } from "react";
import { LineChart, type LineSeriesType } from "@mui/x-charts"; 
import type { ScaleOrdinal } from "d3";

type ColorScale = ScaleOrdinal<string, string>;

export default function Timeline<FC>({
    data,
    parentRect,
    colorScale,
    valueField,
    years
}:{
    data: any[],
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
    valueField: string,
    years: string[]
}) {
    const months = [
        {
            label: "Jul",
            value: 7,
            order: 1
        },{
            label: "Aug",
            value: 8,
            order: 2
        },{
            label: "Sep",
            value: 9,
            order: 3
        },{
            label: "Oct",
            value: 10,
            order: 4
        },{
            label: "Nov",
            value: 11,
            order: 5
        },{
            label: "Dec",
            value: 12,
            order: 6
        },{
            label: "Jan",
            value: 1,
            order: 7
        },{
            label: "Feb",
            value: 2,
            order: 8
        },{
            label: "Mar",
            value: 3,
            order: 9
        },{
            label: "Apr",
            value: 4,
            order: 10
        },{
            label: "May",
            value: 5,
            order: 11
        },{
            label: "Jun",
            value: 6,
            order: 12
        }
    ]
    const [seriesData, setSeriesData] = useState<LineSeriesType[] | []>([]);
    const [chartData, setChartData] = useState<any[] | []>([]);
    useEffect(()=>{
        if (data?.length > 0) {
            let flatData = data.filter(f => years.includes(f.fiscalyear)).sort((a,b) => {
                let aMonth = months.find(f => f.value === a.month);
                let bMonth = months.find(f => f.value === b.month);
                return aMonth && bMonth ? aMonth.order - bMonth.order : 0;
            })
            let serieses = years.map((y) => {
                return {
                    label: y,
                    color: colorScale(y),
                    data: flatData.filter(f => f.fiscalyear === y).map(m => m[valueField] ? m[valueField] : null),
                    type: "line"
                } as LineSeriesType
            })
            setSeriesData(serieses);
            setChartData(flatData);    
        }
    },[years, data, valueField])
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        if (chartData.length > 0 && seriesData.length > 0) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    },[chartData, seriesData])
    return (
        <LineChart 
            loading={loading}
            xAxis={[{
                scaleType: "point",
                data: months.map(m => m.value),
                dataKey: "month",
                valueFormatter: v => {
                    let month = months.find(f => f.value === v)
                    return month ? month.label : "xxx"
                }
            }]}
            yAxis={[{
                scaleType: "linear",
                label: valueField === "trips" ? "# of trips" : "MTCO2e",
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