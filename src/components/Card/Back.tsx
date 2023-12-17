import React, { FC } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
import MAP from '@/core/data/constants/map'

interface Props {
  lat: number
  lng: number
  population: number
  country: string
}

const Back: FC<Props> = ({ lat, lng, population, country }) => {
  return (
    <div className="c-back">
      <ComposableMap width={1000}>
        <Geographies geography={MAP}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
        <Marker coordinates={[lng, lat]}>
          <circle cx={0} cy={0} r={6} fill="#f00" />
        </Marker>
      </ComposableMap>
    </div>
  )
}

export default Back
