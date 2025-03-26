import { BarChart, type BarItem, type BarLabelContext } from "@mui/x-charts/BarChart";
import styles from "./barChart.module.scss";
import { useEffect, useState, type ReactElement } from "react";

interface DataPoint {
    [index: string]: number | string;
  }
  
  interface DataSet {
    year: number;
    data: DataPoint[];
  }
  
export default function BarChartVariants({
    data,
    orientation,
    xScale,
    yScale,
    parentRect,
    labelField,
    valueField
}:{
    data: DataSet[],
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
    valueField: string
}) {
    console.log(data)
    const [marginLeft, setMarginLeft] = useState(0);
    useEffect(() => {
        let labelMap = data[0].data.map((item) => typeof item[labelField] === "string" ? item[labelField].length : 0)
        setMarginLeft(Math.max(...labelMap) * 8)
    }, [data, labelField])
    console.log(marginLeft)
    const maxVal = Math.max(...data[0].data.map((d) => typeof d[valueField] === "number" ? d[valueField] : 0));
    const barColors = data[0].data.map((val) => {
      if (val[valueField] === maxVal) {
        return "#002D72";
      
      } else {
        return "#AAA"; // non-max and non-min values take default color of series
      }
    });
    if (marginLeft > 0) {
        return (
            <BarChart className={styles.bar11}
            margin={{left: marginLeft}}
            layout={orientation}
            xAxis={[
            { 
                scaleType: xScale,
            
            }]}
            yAxis={[
            { scaleType: yScale, 
                data: data[0].data.map((item) => item[labelField]), 
                disableTicks: true,
                colorMap: {
                type: "ordinal",
                
                colors: barColors,
                },
            }
    
            ]}
            series={[
            {
                data: data[0].data.map((item) => item[valueField]),
                
            },
            ]}
            width={parentRect?.width}
            height={parentRect?.height}
            bottomAxis={null}
            sx={{
                // Customize x-axis line (grey, thick)
                "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                    stroke: "#CCC",
                    strokeWidth: 4,
                    color: "#000",
                }
            }}
            barLabel={valueField}
            />
        )    
    } else {
        return null
    }
}
