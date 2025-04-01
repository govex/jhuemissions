import { useState, useEffect } from "react";
import * as d3 from 'd3';
import type { ExtendedFeatureCollection } from "d3";

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
  data: any;
};

export const ConnectionMap = ({ parentRect, data }: MapProps) => {
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
    const [loading, setLoading] = useState(true);
    const [countryPaths, setCountryPaths] = useState<any[] | undefined>(undefined);
    const [connections, setConnections] = useState<any[] | undefined>(undefined);
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
            if (data) {
                let lines = data.get("FY23-24")?.map((connection, i) => {
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
        
    },[data, parentRect.width, parentRect.height, world, loading])
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
            {!loading && !!data && connections}
        </svg>
        </div>
    );
};
