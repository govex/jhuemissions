import {useState, useEffect} from 'react';
import { format } from "d3";
import { SparkLineChart } from "@mui/x-charts";
import styles from "./infographic.module.scss";

type infoData = {
    year: string,
    value: number
}[]

function Infographic({data, years, parentRect, unit, formatString}:{
    data: infoData, 
    years: any, 
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
    unit?:string
    formatString?:string
}) {
    const innercontent = () => {
        if (value?.length === 1) {
            return (
                <>
                <h2 className={styles.stat}>{format(!!formatString ? formatString : ",")(parseInt(value[0]))}</h2>
                {!!unit && <p className={styles.unit}>{unit}</p>}
                {changeText ?
                    (<p className={styles.change}>{changeText.value} change from {changeText.priorYear} </p>)
                    : 
                    (<p className={styles.change}>prior year unavailable</p>)
                }
                </>
            )
        } else if (value?.length > 1) {
            const sparkData = years.map(m => parseInt(data.find(f => f.year === m)?.value))
            
            return (
                <SparkLineChart 
                    data={sparkData}
                    height={dims.height}
                    width={dims.width}
                    showHighlight
                    showTooltip
                    xAxis={{
                        scaleType:"point",
                        data: years
                    }}
                />
            )
        }
    }
    const [value, setValue] = useState<any | undefined>(undefined);
    useEffect(()=>{
        let val = data.filter(f => years.includes(f.year));
        if (val.length === 1) {
            setValue([val[0].value])
        } else if (val.length > 1) {
            setValue(val.map(m => m.value))
        }
    },[data,years])
    const [changeText, setChangeText] = useState<{value: string, priorYear: string} | undefined>(undefined);
    useEffect(()=>{
        if (value?.length === 1) {
            let dataI = data.findIndex(d => d.year == years[0])
            let previousRow = data[dataI+1]
            if (previousRow?.value > 0 && data[dataI].year == years[0]) {
                const change = data[dataI].value - previousRow.value
                const perCh = (change / previousRow.value)
                if (!!perCh) {
                    setChangeText({value: format("+.2p")(perCh), priorYear: previousRow.year})
                } else {
                    setChangeText(undefined)
                }
            }
        } else {
            setChangeText(undefined)
        }    
    },[data, years, value])
    const [dims, setDims] = useState<{width: number, height:number} | undefined>(undefined)
    useEffect(() => {
        if (parentRect) {
            setDims({width: parentRect.width, height:parentRect.height})
        }
    }, [parentRect.width, parentRect.height])
    const [render, setRender] = useState(false);
    useEffect(() => {
        if (
            data?.length > 0 &&
            years?.length > 0 &&
            !!dims &&
            !!value
        ) {
            setRender(true)
        } else {
            setRender(false)
        }
    }, [data, years, dims, value])
    return (
        <div>
            {render &&
                innercontent()
            }
        </div>
    )
}

export default Infographic;