'use client'

import Back from '@/components/Card/Back'
import Front from '@/components/Card/Front'
import { FC, useState } from 'react'
import { ICity } from '@/core/types/ICity'

interface Props {
  city: ICity
  isFlipped?: boolean
}

const Card: FC<Props> = ({ city, isFlipped }) => {
  return (
    <div className="c-card">
      <div className="c-card__inside">
        {!isFlipped ? (
          <Front name={city.name} />
        ) : (
          <Back
            lat={city.lat}
            lng={city.lng}
            population={city.population}
            country={city.country}
          />
        )}
      </div>
    </div>
  )
}

export default Card
