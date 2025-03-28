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
  data?: any;
};

type Connection = {
    from: string;
    to: string;
    from_lat: number;
    from_lng: number;
    to_lat: number;
    to_lng: number;
    total_trips: number;
    total_emissions: number;
    fiscalyear: string;
    school: string;
}

export const Map = ({ parentRect, data }: MapProps) => {
    const lineWidthScale = d3.scaleLinear().range([2, 8])
    const [lineWidthDomain, setLineWidthDomain] = useState([1,100]);
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
    const [mapData, setMapData] = useState<Connection[]>([]);
    const [connections, setConnections] = useState<any[] | undefined>(undefined);
    useEffect(() => {
      d3.json("./data/ne_world_countries.json").then((d) => {
        setWorld(d);
        setLoading(false);
      });
      return () => undefined;
    }, []);
    useEffect(()=>{
        d3.csv("./data/map_example.csv").then((d) => {
            setMapData(d);
            let domain = d3.extent(d.map(m => +m.total_trips));
            setLineWidthDomain(domain);
        })
    },[])
    useEffect(()=>{
        if (!loading) {
            projection.fitSize([parentRect.width, parentRect.height], world); 
            geoPathGenerator.projection(projection);    
            if (mapData.length > 0) {
                let lines = mapData.map((connection, i) => {
                    const path = geoPathGenerator({
                        type: 'LineString',
                        coordinates: [
                            [connection.from_lng, connection.from_lat],
                            [connection.to_lng, connection.to_lat]
                        ]
                    })
                    const keyId = connection.from.slice(0,2) + "_" + connection.to.slice(0,2) + i

                    return (
                        <path
                          key={keyId}
                          d={path ?? undefined}
                          stroke="#A15B96"
                          strokeWidth={lineWidthScale.domain(lineWidthDomain)(connection.total_trips)}
                          fill="none"
                          opacity={0.5}
                        />
                      );
                })
                setConnections(lines);
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
            .map((shape) => {
                console.log(shape.iso_a3);
                return (
                    <path
                    key={shape.iso_a3}
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
            {!loading && mapData.length > 0 && connections}
        </svg>
        </div>
    );
};
