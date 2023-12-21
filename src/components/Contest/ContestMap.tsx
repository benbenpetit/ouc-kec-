import React, { FC } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
import MAP from '@/core/data/constants/map'
import { ICity } from '@/core/types/ICity'

interface Props {
  cities: ICity[]
}

const ContestMap: FC<Props> = ({ cities }) => {
  return (
    <div className="c-contest-map">
      <ComposableMap width={1000}>
        <Geographies geography={MAP}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#fff8f1"
                stroke="#66bfff"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>
        {cities.map((city) => (
          <Marker key={city.name} coordinates={[city.lng, city.lat]}>
            <circle cx={0} cy={0} r={2} fill="#ff0026" />
            <text textAnchor="middle" y={-10}>
              {city.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}

export default ContestMap
