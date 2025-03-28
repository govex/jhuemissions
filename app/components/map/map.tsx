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
  data?: any;
};

export const Map = ({ parentRect, data }: MapProps) => {
  const [world, setWorld] = useState<ExtendedFeatureCollection>({
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
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
    useEffect(() => {
      d3.json("./data/ne_world_countries.json").then((d) => {
        setWorld(d);
        setLoading(false);
      });
      return () => undefined;
    }, []);

    const projection = d3
        .geoNaturalEarth1()
        .fitSize([parentRect.width, parentRect.height], world)
    const geoPathGenerator = d3.geoPath().projection(projection);

    useEffect(()=> {
        projection.fitSize([parentRect.width, parentRect.height], world); 
        geoPathGenerator.projection(projection);
        if (!loading) {
            let paths = world.features
            .filter((shape) => shape.id !== 'ATA')
            .map((shape) => {
                return (
                    <path
                    key={shape.id}
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
    },[world, parentRect])


return (
    <div>
      <svg width={parentRect.width} height={parentRect.height}>
        {!loading && countryPaths}
      </svg>
    </div>
  );
};
