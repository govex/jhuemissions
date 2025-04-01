import { format } from "d3";
import { SparkLineChart } from "@mui/x-charts";
import styles from "./infographic.module.scss";

type infoData = {
    year: string,
    value: any | any[]
}[]

function Infographic({data, years, display, unit}:{data: infoData, years: any, display: string, unit?:string}) {
    const innercontent = () => {
    // if there's only one year in the filtered years list
    if (years.length === 1) {
        // and the display type is travelled
        let value = data.find(f => f.year === years[0])?.value
        if (!!value) {
            if (display === "travelled") {
            // display cities and values as numbered list
                return (
                    <ol className={styles.travellist}>
                        {value.map(([city, trips]) => {
                            return (
                                <li>{city}: {trips} trips</li>
                            )
                        })
                        }
                    </ol>
                    )    
            } else {
            // and the display type is not travelled
            // and if there is a prior year of data in the data list
            // display a large formatted number
            // calculate and display the % change from the prior year

            let changeText = "";
                for (let i = 0; i < data.length; i++) {
                    const previousRow = data[i-1];
                    if (previousRow?.value) {
                        if (previousRow.value > 0) {
                            const change = data[i].value - previousRow.value
                            const perCh = (change / previousRow.value)
                            if (!!perCh) {
                                changeText = format("+.2p")(perCh)
                            }
                        }
                    }
                }
                return (
                    <>
                    <h2 className={styles.stat}>{format(",")(parseInt(value))}</h2>
                    {unit && <p className={styles.unit}>{unit}</p>}
                    {changeText.length > 0 &&
                        <p className={styles.change}>{changeText} change from prior year</p>
                    }
                    </>
                )
            }
        } else {
            return (
                <p>There was an error with this stat.</p>
            )
        }
    } else {
    // if there's more than one year in the filtered years list
        // and the display type is travelled
        if (display === "travelled") {
            // aggregate the trips per city 
            // and display the top five cities and values as a numbered list
            // and add a note with years included
            let value = data.find(f => f.value)?.value
            if (!!value) {
                // display cities and values as numbered list
                return (
                    <ol className={styles.travellist}>
                        {value.map(([city, trips]) => {
                            return (
                                <li>{city}: {trips} trips</li>
                            )
                        })
                        }
                    </ol>
                    )    
                }
        } else {
        // and the display type is not travelled
            const sparkData = years.map(m => parseInt(data.find(f => f.year === m)?.value))
            // display a sparkline and the most recent year's value
            // and add a note with years included
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

    }
    return (
        <div>
            {innercontent()}
        </div>
    )
}

export default Infographic;