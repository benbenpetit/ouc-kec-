'use client'

import Back from '@/components/Card/Back'
import Front from '@/components/Card/Front'
import { FC, useState } from 'react'
import { ICity, ICityFull } from '@/core/types/ICity'

interface Props {
  city?: ICity
  fullCity?: ICityFull
  isFlipped?: boolean
}

const Card: FC<Props> = ({ city, fullCity, isFlipped }) => {
  return (
    <div className="c-card">
      <div className="c-card__inside">
        {!isFlipped ? (
          <Front name={city?.name || fullCity?.name || ''} />
        ) : (
          fullCity && <Back city={fullCity} />
        )}
      </div>
    </div>
  )
}

export default Card
