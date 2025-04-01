import styles from "./legend.module.scss";
import { type FC, useState, useEffect } from "react";
import type { ScaleOrdinal } from "d3";

type ColorScale = ScaleOrdinal<string, string>;

export default function Legend<FC>( colorScale: ColorScale ) {
    const [colors, setColors] = useState(colorScale.domain());
    const [years, setYears] = useState(colorScale.range());
    useEffect(()=>{
        setColors(colorScale.domain());
        setYears(colorScale.range());
    },[colorScale])
    return (
        <div></div>
    )
}