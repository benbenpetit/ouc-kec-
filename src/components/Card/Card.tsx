'use client'

import Back from '@/components/Card/Back'
import Front from '@/components/Card/Front'
import { FC, useState } from 'react'
import { ICity } from '@/core/types/ICity'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  city: ICity
}

const Card: FC<Props> = ({ city }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: city.name,
    data: {
      type: 'card',
      city,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        className="c-card is-grabbing"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className="c-card__inside" />
      </div>
    )
  }

  return (
    <div
      className="c-card"
      onClick={() => setIsFlipped(!isFlipped)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
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
