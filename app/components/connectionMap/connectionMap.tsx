import { useState, useEffect } from "react";
import * as d3 from 'd3';

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
  year: string[];
};

type ConnectionData = Map<string, Connection[]>
type Connection = {
    from_full: string;
    to_full: string;
    from_lat: number;
    from_lng: number;
    to_lat: number;
    to_lng: number;
    total_trips: number;
    total_emissions: number;
    fiscalyear: string;
    school: string;
}

export const ConnectionMap = ({ parentRect, year = ["FY202425"] }: MapProps) => {
    const [world, setWorld] = useState({
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
    const [loading, setLoading] = useState(true);
    const [countryPaths, setCountryPaths] = useState<any[] | undefined>(undefined);
    const [mapData, setMapData] = useState<ConnectionData | undefined>(undefined);
    const [connections, setConnections] = useState<any[] | undefined>(undefined);
    useEffect(() => {
      d3.json("./data/ne_world_countries.json").then((d) => {
        setWorld(d);
        setLoading(false);
      });
      return () => undefined;
    }, []);
    useEffect(()=>{
        d3.csv("./data/trips_between_locations_by_school.csv", (d) => {
            return {
                from_full: d.from_full,
                to_full: d.to_full,
                from_lat: +d.from_lat,
                from_lng: +d.from_lng,
                to_lat: +d.to_lat,
                to_lng: +d.to_lng,
                total_trips: +d.total_trips,
                total_emissions: +d.total_emissions,
                fiscalyear: d.fiscalyear.replace("-", ""),
                school: d.school            
            } as Connection
        }).then((d) => {
            let grouped = d3.group(d, d=>d.fiscalyear)
            setMapData(grouped);
        })
    },[])
    useEffect(()=>{
        if (!loading) {
            projection.fitSize([parentRect.width, parentRect.height], world); 
            geoPathGenerator.projection(projection);    
            if (mapData) {
                if (year.length === 1) {
                let lines = mapData.get(year[0]).map((connection, i) => {
                    const path = geoPathGenerator({
                        type: 'LineString',
                        coordinates: [
                            [connection.from_lng, connection.from_lat],
                            [connection.to_lng, connection.to_lat]
                        ]
                    })
                    const keyId = connection.from_full.slice(0,2) + "_" + connection.to_full.slice(0,2) + i

                    return (
                        <path
                          key={keyId}
                          d={path ?? undefined}
                          stroke="#A15B96"
                          strokeWidth={0.5}
                          fill="none"
                          opacity={0.25}
                        />
                      );
                })
                setConnections(lines);
            }
            }
        }
        
    },[mapData, parentRect.width, parentRect.height, world, loading])
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
                return (
                    <path
                    key={`${shape.iso_a3}${i}`}
                    d={geoPathGenerator(shape)}
                    stroke="lightGrey"
                    strokeWidth={0.5}
                    fill="grey"
                    fillOpacity={0.7}
                    />
                );
            }); 
            setCountryPaths(paths);
        }
    },[world, parentRect.width, parentRect.height, loading])
    return (
        <div>
        <svg width={parentRect.width} height={parentRect.height}>
            {!loading && countryPaths}
            {!loading && !!mapData && connections}
        </svg>
        </div>
    );
};
