import { BarChart, type BarSeriesType } from "@mui/x-charts";
import styles from "./barChart.module.scss";
import cx from "classnames";
import { type FC, useState, useEffect } from "react";
import type { ScaleOrdinal } from "d3";
import { max } from "d3";

type ColorScale = ScaleOrdinal<string, string>;

export default function BarChartVariants<FC>({
    data,
    orientation,
    xScale,
    yScale,
    parentRect,
    labelField,
    valueField,
    school,
    schoolOptions,
    colorScale,
    years,
    schoolFilter = true
}:{
    data: any[],
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
    labelField: string,
    valueField: string,
    school: string,
    schoolOptions: any[],
    colorScale: ColorScale,
    years: string[]
    schoolFilter?: Boolean
}) {
    const [schoolValue, setSchoolValue] = useState<string | undefined>(undefined);
    const [groupLabels, setGroupLabels] = useState<string[] | []>([]);
    const [overflowScroll, setOverflowScroll] = useState<Boolean>(false);
    const [marginLeft, setMarginLeft] = useState(0);
    const [maxVal, setMaxVal] = useState(0);
    const [chartData, setChartData] = useState<any[]>([]);
    const [seriesData, setSeriesData] = useState<BarSeriesType[] | []>([])
    useEffect(() => {
        if (schoolOptions) {
            let opt = schoolOptions.find(s => s.label === school)
            setSchoolValue(opt?.value)    
        } 
    }, [school, schoolOptions])
    useEffect(() => {
        if (data && data?.length > 0) {
            if (school === "All JHU") {
                let flatData = data.filter(f => years.includes(f.fiscalyear)).sort((a,b)=>b[valueField]-a[valueField]); 
                let serieses = years.map((y) => {
                    return {
                        label: y,
                        color: colorScale(y),
                        data: flatData.map(m => m[valueField]),
                        type: "bar"
                    } as BarSeriesType
                })
                setSeriesData(serieses);    
                setChartData(flatData);
            } else if (schoolFilter && schoolValue) {
                let flatData = data.filter(f => years.includes(f.fiscalyear) && f.school === schoolValue).sort((a,b)=>b[valueField]-a[valueField]);
                let serieses = years.map((y) => {
                    return {
                        label: y,
                        color: colorScale(y),
                        data: flatData.filter(f => f.fiscalyear === y).map(m => m[valueField]),
                        type: "bar"
                    } as BarSeriesType
                })
                setSeriesData(serieses);    
                setChartData(flatData);
            } else if (schoolValue) {
                let flatData = data.filter(f => years.includes(f.fiscalyear)).sort((a,b)=>b[valueField]-a[valueField]);
                let serieses = years.map((y) => {
                    let yearData = flatData.filter(f => f.fiscalyear === y);
                    let schoolIdx = yearData.findIndex(f => f.school === schoolValue);
                    let spliced = yearData.splice(schoolIdx, 1);
                    let reordered = [spliced[0], ...yearData];
                    return {
                        label: y,
                        color: colorScale(y),
                        data: reordered.map(m => m[valueField]),
                        type: "bar"
                    } as BarSeriesType
                })
                setSeriesData(serieses);
                setChartData(flatData)
            }
        } 
    }, [data, valueField, years, school, schoolOptions, schoolValue])
    useEffect(() => {
        if (chartData.length > 0) {
            let labels = Array.from(new Set<string>(chartData.map(m => m[labelField])));
            if (schoolValue && !schoolFilter) {
                let schoolIdx = labels.findIndex(f => f === schoolValue)
                let spliced = labels.splice(schoolIdx, 1)
                labels = [spliced[0], ...labels]
            }
            let maxLength = max(labels.map(m => m.length));
            let maxVal = max(chartData, d => +d[valueField])
            setMaxVal(maxVal ? maxVal : 0)
            setMarginLeft(maxLength ? maxLength * 7 : 70);
            setGroupLabels(!schoolFilter
                ? labels.map(m => {
                    let opt = schoolOptions.find(s => s.value === m)
                    return opt.label
                    })
                : labels
            );
        } 
    }, [chartData, labelField, valueField, schoolOptions, years, school])
    const [realHeight, setRealHeight] = useState(parentRect.height)
    useEffect(()=>{
        if (groupLabels && groupLabels?.length > 15) {
            setRealHeight(groupLabels.length * 42)            
            setOverflowScroll(true)
        } else {
            setRealHeight(parentRect.height)
            setOverflowScroll(false)
        }
    },[groupLabels, parentRect.height])
    const [render, setRender] = useState(false);
    useEffect(()=>{
        if (
            marginLeft > 0 &&
            seriesData.length > 0 &&
            maxVal > 0 &&
            groupLabels.length > 0
        ) {
            setRender(true);
        } else {
            setRender(false);
        }
    },[marginLeft, seriesData, maxVal, groupLabels, realHeight])
    return (
        <div className={cx(styles.base, overflowScroll ? styles.overflowscroll : "")}>
            <BarChart 
                className={styles.bar11}
                loading={!render}
                margin={{left: marginLeft, right: 70}}
                layout={orientation}
                yAxis={[{ 
                    scaleType: yScale,
                    data: groupLabels, 
                }]}
                xAxis={[{ scaleType: xScale, 
                    position: "top",
                    disableTicks: true,
                    label: valueField === "trips"
                        ? "# of trips"
                        : "MTCO2e"
                }]}
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
}
