import SelectableCard from '@/components/Card/SelectableCard'
import { ICityFull } from '@/core/types/ICity'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import React, { FC, useMemo } from 'react'

interface Props {
  direction: 'left' | 'right' | 'top' | 'bottom'
  cities: ICityFull[]
  onClickCard: (city: ICityFull) => void
  clickableCards?: ICityFull[]
}

const Direction: FC<Props> = ({
  direction,
  cities,
  onClickCard,
  clickableCards,
}) => {
  const cardsIds = useMemo(() => cities.map((city) => city.id), [cities])

  const isClickable = (city: ICityFull) => {
    return clickableCards?.some((clickableCity) => clickableCity.id === city.id)
  }

  const { setNodeRef, attributes } = useSortable({
    id: direction,
    disabled: true,
    data: {
      type: 'Direction',
      direction,
    },
  })

  const COMPASS_LETTERS = {
    left: 'W',
    right: 'E',
    top: 'N',
    bottom: 'S',
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`c-board__direction --${direction}`}
    >
      <SortableContext items={cardsIds}>
        {cities.map((city, index) => (
          <SelectableCard
            key={city.id}
            city={city}
            disabled={city.isStatic}
            isContestable={isClickable(city)}
            onClick={() => isClickable(city) && onClickCard(city)}
          />
        ))}
      </SortableContext>
      <div className="c-board__direction__letter">
        <span>{COMPASS_LETTERS[direction]}</span>
      </div>
    </div>
  )
}

export default Direction
