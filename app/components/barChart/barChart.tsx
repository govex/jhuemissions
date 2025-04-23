import { BarChart, type BarSeriesType } from "@mui/x-charts";
import styles from "./barChart.module.scss";
import cx from "classnames";
import { type FC, useState, useEffect } from "react";
import type { ScaleOrdinal } from "d3";
import { max, format } from "d3";

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
    schoolFilter = true,
    stack = false
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
    schoolFilter?: Boolean,
    stack?: Boolean
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
            if (stack) {
                let flatData = data.filter(f => years.includes(f.fiscalyear));
                let groups = Array.from(new Set(flatData.map(m => m[labelField])));
                let serieses = groups.map((group) => {
                    let groupData = flatData.filter(f => f[labelField] === group);
                    return {
                        label: labelField === "school" ? schoolOptions.find(f => f.value === group).label : group,
                        stack: "total",
                        data: years.map(m => {
                            let yearData = groupData.find(f => f.fiscalyear === m);
                            return yearData ? yearData[valueField] : 0
                        }),
                        highlightScope: {
                            highlight: "series",
                            fade: "global"
                        },
                        valueFormatter: (v:number) => format(".3p")(v),
                        type: "bar"
                    } as BarSeriesType;
                });
                const modifiedSeries:BarSeriesType[] = [{ ...serieses[0], stackOffset: "expand", stackOrder: "ascending" }, ...serieses.slice(1)];
                setSeriesData(modifiedSeries);
                setChartData(flatData);
            } else if (school === "All JHU") {
                let flatData = data.filter(f => years.includes(f.fiscalyear)).sort((a,b)=>b[valueField]-a[valueField]); 
                let serieses = years.map((y) => {
                    return {
                        label: y,
                        color: colorScale(y),
                        data: flatData.filter(f => f.fiscalyear === y).map(m => m[valueField]),
                        type: "bar"
                    } as BarSeriesType;
                });
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
                    } as BarSeriesType;
                });
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
                    } as BarSeriesType;
                });
                setSeriesData(serieses);
                setChartData(flatData);
            }
        } 
    }, [data, valueField, years, school, schoolOptions, schoolValue, stack])
    useEffect(() => {
        if (chartData.length > 0) {
            let labels = Array.from(new Set<string>(chartData.map(m => m[labelField])));
            if (schoolValue && !schoolFilter && !stack) {
                let schoolIdx = labels.findIndex(f => f === schoolValue);
                let spliced = labels.splice(schoolIdx, 1);
                labels = [spliced[0], ...labels];
            }
            if (stack) {
                labels = years
            }
            let maxLength = max(labels.map(m => m.length));
            let maxVal = max(chartData, d => +d[valueField]);
            setMaxVal(maxVal ? maxVal : 0);
            setMarginLeft(maxLength ? maxLength * 7 : 70);
            setGroupLabels(!schoolFilter && !stack
                ? labels.map(m => {
                    let opt = schoolOptions.find(s => s.value === m)
                    return opt.label
                    })
                : labels
            );
        } 
    }, [chartData, labelField, valueField, schoolOptions, years, school, stack])
    const [realHeight, setRealHeight] = useState(parentRect.height)
    useEffect(()=>{
        if (!stack && groupLabels && groupLabels?.length > 15) {
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
            maxVal !== 0 &&
            groupLabels.length > 0
        ) {
            setRender(true);
        } else {
            setRender(false);
        }
    },[marginLeft, seriesData, maxVal, groupLabels])
    return (
        <div className={cx(styles.base, overflowScroll ? styles.overflowscroll : "")}>
            <BarChart 
                className={styles.bar11}
                loading={!render}
                margin={{top: overflowScroll ? 80 : 50,left: stack ? 70 : marginLeft, right: 50}}
                layout={orientation}
                yAxis={[{ 
                    scaleType: yScale,
                    data: stack ? years : groupLabels      
                }]}
                xAxis={[{ id: "mainX", 
                    scaleType: xScale, 
                    disableTicks: true,
                    label: valueField === "trips"
                        ? `${stack ? "%" : "#"} of trips`
                        : `${stack ? "% " : ""}MTCO2e`,
                    colorMap: stack ? {
                        type: "continuous",
                        min: 0,
                        max: maxVal,
                        color: ["#ECECEC","#A15B96"]
                    } : undefined,
                }]}
                axisHighlight={{y: stack ? "none" : "band"}}
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
}
