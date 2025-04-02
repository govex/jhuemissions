import styles from "./legend.module.scss";
import { type FC, useState, useEffect } from "react";
import type { ScaleOrdinal } from "d3";

type ColorScale = ScaleOrdinal<string, string>;

export default function Legend<FC>( {colorScale} : {
    colorScale: ColorScale,
} ) {
    const [colors, setColors] = useState(colorScale.range());
    const [years, setYears] = useState(colorScale.domain());
    useEffect(()=>{
        setColors(colorScale.range());
        setYears(colorScale.domain());
    },[colorScale])
    return (
        <div className={styles.legend}>
            {years.map((d,i) => {
                return (
                    <div className={styles.colorgroup} key={d}>
                    <div className={styles.colorsquare} style={{backgroundColor: colors[i]}}></div>
                    <h4>{d}</h4>
                    </div>
                )
            })}
        </div>
    )
}