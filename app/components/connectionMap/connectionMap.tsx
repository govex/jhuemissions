import { useState, useEffect, type ChangeEvent, type FC, type SyntheticEvent } from "react";
import * as d3 from 'd3';
import type { ExtendedFeatureCollection, InternMap, ScaleOrdinal } from "d3";
import { styled, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Autocomplete, TextField } from '@mui/material';
import type {AutocompleteChangeReason} from "@mui/material";
import { formatPlaces } from "~/utils/titleCase";
import styles from "./connectionMap.module.scss"

type ColorScale = ScaleOrdinal<string, string>;

type MapProps = {
  parentRect: {
    bottom: number,
    height: number,
    left: number,
    right: number,
    top: number,
    width: number,
    x: number,
    y: number
  };  
  data: any[],
  years: string[];
  colorScale: ColorScale;
  places: any[];
};
const BpIcon = styled('span')(({ theme }) => ({
    marginLeft: 4,
    borderRadius: 3,
    width: 25,
    height: 25,
    backgroundColor: '#fff',
    border: "3px solid #AAAAAA",
    '.Mui-focusVisible &': {
      outline: '2px auto #A15A95',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#A15A9599',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  }));
  
  const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#A15A95',
    'input:hover ~ &': {
      backgroundColor: '#A15A9599',
    },
  });
  
export default function ConnectionMap<FC>({ parentRect, data, years, colorScale, places }: MapProps) {
    const [world, setWorld] = useState<ExtendedFeatureCollection>({
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "properties": {"iso_a3":"BOX"},
            "geometry": {
            "coordinates": [
                [
                [
                    -171.49579802034714,
                    79.00123060853025
                ],
                [
                    -171.49579802034714,
                    -58.06630651097032
                ],
                [
                    188.4838219426589,
                    -58.06630651097032
                ],
                [
                    188.4838219426589,
                    79.00123060853025
                ],
                [
                    -171.49579802034714,
                    79.00123060853025
                ]
                ]
            ],
            "type": "Polygon"
            }
        }
        ]
    });
    const lineWidthScale = d3.scaleLog().range([.25, 5]);
    const [loading, setLoading] = useState(true);
    const [placeHighlight, setPlaceHighlight] = useState<string | undefined>(undefined);
    const [countryPaths, setCountryPaths] = useState<any[] | undefined>(undefined);
    const [connections, setConnections] = useState<any[] | undefined>(undefined);
    const [displayYear, setDisplayYear] = useState<string | undefined>(undefined);
    const [displayPaths, setDisplayPaths] = useState<any[] | undefined>(undefined);
    const handleChange = (event: SyntheticEvent, value: string, reason: AutocompleteChangeReason) => {
        if (event.type === "change" && reason === undefined) {
            setDisplayYear(value);
        } else {
            if (value) {
                setPlaceHighlight(value);
            } else {
                setPlaceHighlight(undefined);
            }
        }
    }
    useEffect(() => {
        if (connections !== undefined){
            if (connections.length > 1) {
                let cYear = connections.find(f => f.year === displayYear)
                if (cYear?.paths?.length > 0) {
                    setDisplayPaths([...cYear.paths, ...cYear.highlight])
                }
            } else {
                if (connections[0].paths?.length > 0) {
                    setDisplayPaths([...connections[0].paths, ...connections[0].highlight])
                }
            }                
        }
    }, [displayYear, connections])
    useEffect(() => {
      d3.json<ExtendedFeatureCollection>("./data/ne_world_countries.json").then((d) => {
        if (d) {
            setWorld(d);
            setLoading(false);    
        }
      });
    }, []);
    useEffect(()=>{
        if (!loading) {
            projection.fitSize([parentRect.width, parentRect.height], world); 
            geoPathGenerator.projection(projection);    
            if (data && places && years) {
                let lines = years.map(y => {
                    let yearData = data.filter(f => f.fiscalyear === y)
                    if (yearData?.length > 0) {
                        let extentTrips = d3.extent(yearData, d => d.trips)
                        lineWidthScale.domain(extentTrips)
                        let yearLines = [];
                        let highlightLines = []; 
                        yearData.forEach((connection, i) => {
                            let from_place = places.find(f => f.place === connection.from_full)
                            let to_place = places.find(f => f.place === connection.to_full)
                            let highlight = formatPlaces(from_place.place) === placeHighlight || formatPlaces(to_place.place) === placeHighlight;
                            const path = geoPathGenerator({
                                type: 'LineString',
                                coordinates: [
                                    [from_place.lng, from_place.lat],
                                    [to_place.lng, to_place.lat]
                                ]
                            })
                            const keyId = from_place.place.slice(0,2) + "_" + to_place.place.slice(0,2) + `_${i}`
                            if (highlight) {
                                highlightLines.push(
                                    <path
                                        key={keyId}
                                        d={path ?? undefined}
                                        stroke={"#A15B96"}
                                        strokeWidth={lineWidthScale(connection.trips)}
                                        fill="none"
                                        opacity={.25}
                                    />
                                )
                            } else {
                                yearLines.push(
                                    <path
                                        key={keyId}
                                        d={path ?? undefined}
                                        stroke={colorScale(y)}
                                        strokeWidth={lineWidthScale(connection.trips)}
                                        fill="none"
                                        opacity={0.25}
                                    />
                                )
                            }
                        })                        
                        return {
                            year: y, 
                            paths: yearLines, 
                            highlight: highlightLines, 
                            yearData
                        }
                    } else {
                        return {
                            year: y, 
                            paths: [], 
                            highlight: [], 
                            yearData: []
                        }
                    }
                })
            
                setConnections(lines);
                if (lines.length > 1) {
                    let displayableYear = lines.find(f => f.yearData.length > 0);
                    setDisplayYear(displayableYear?.year)
                }
        }}
    },[data, parentRect.width, parentRect.height, world, loading, places, placeHighlight])

    const projection = d3
        .geoNaturalEarth1()
        .fitSize([parentRect.width, parentRect.height], world)
    const geoPathGenerator = d3.geoPath().projection(projection);

    useEffect(()=> {
        projection.fitSize([parentRect.width, parentRect.height], world); 
        geoPathGenerator.projection(projection);
        if (!loading) {
            let paths = world.features
            .map((shape,i) => {
                let country = geoPathGenerator(shape);
                return (
                    <path
                    key={`${shape.iso_a3}${i}`}
                    d={country ?? undefined}
                    stroke="#BCBCBC"
                    strokeWidth={0.5}
                    fill="#ECECEC"
                    fillOpacity={0.7}
                    />
                );
            }); 
            setCountryPaths(paths);
        }
    },[world, parentRect.width, parentRect.height, loading])
    const yearButtons = () => {
        if (connections) {
            return (
                <div className={styles.form}>
                    {connections.length > 1 && (
                        <FormControl>
                            <FormLabel id="radio-buttons-group-label">Fiscal Year</FormLabel>
                            <RadioGroup
                                aria-labelledby="radio-buttons-group-label"
                                value={displayYear}
                                onChange={handleChange}
                                name="radio-buttons-group"
                            >
                                {connections?.map(c => {
                                    return (
                                        <FormControlLabel 
                                            disabled={c.yearData.length < 1}
                                            value={c.year} 
                                            control={<Radio
                                                checkedIcon={<BpCheckedIcon />}
                                                icon={<BpIcon />}
                                                disableRipple
                                            />} 
                                            label={c.year} />
                                    )
                                })}
                            </RadioGroup>
                        </FormControl>
                    )}
                    <FormControl>
                        <FormLabel>Highlight Place</FormLabel>
                        <Autocomplete
                            onChange={handleChange}
                            options={places.map(m => formatPlaces(m.place))}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{
                            backgroundColor: "transparent",
                            color: "#A15B96",
                            fontWeight: "600",
                            fontSize: "24px",
                            border: "none"
                            }}
                        />
                    </FormControl>
                </div>
              );    
        } else {
            return <></>;
        }
    }
    return (
        <div className={styles.mapContainer}>
            <div className={styles.legend}>
                {yearButtons()}
            </div>
            <svg width={parentRect.width} height={parentRect.height}>
                {!loading && countryPaths}
                {!loading && displayPaths}
            </svg>
        </div>
    );
};
