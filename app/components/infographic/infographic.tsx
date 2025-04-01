import {useState, useEffect} from 'react';
import { format } from "d3";
import { SparkLineChart } from "@mui/x-charts";
import styles from "./infographic.module.scss";

type infoData = {
    year: string,
    value: number
}[]

function Infographic({data, years, unit}:{data: infoData, years: any, unit?:string}) {
    const innercontent = ({
        value, changeText
    }:{
        value: number[],
        changeText: {value: string, priorYear: string} | undefined,
    }) => {
        if (value?.length === 1 && !!changeText) {

            return (
                <>
                <h2 className={styles.stat}>{format(",")(parseInt(value[0]))}</h2>
                {!!unit && <p className={styles.unit}>{unit}</p>}
                <p className={styles.change}>{changeText.value} change from {changeText.priorYear} </p>
                </>
            )
        } else if (value?.length > 1) {
            const sparkData = years.map(m => parseInt(data.find(f => f.year === m)?.value))

            return (
                <SparkLineChart 
                    data={sparkData}
                    height={200}
                    width={300}
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
                }
            }
        }    
    },[data, years, value])


    return (
        <div>
            {data.length > 0 && years.length > 0 &&
                innercontent({value, changeText})
            }
        </div>
    )
}

export default Infographic;