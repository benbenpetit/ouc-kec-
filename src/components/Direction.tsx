import SelectableCard from '@/components/Card/SelectableCard'
import { ICityFull } from '@/core/types/ICity'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import React, { FC, useMemo } from 'react'

interface Props {
  direction: 'left' | 'right' | 'top' | 'bottom'
  cities: ICityFull[]
}

const Direction: FC<Props> = ({ direction, cities }) => {
  const cardsIds = useMemo(() => cities.map((city) => city.id), [cities])

  const { setNodeRef, attributes } = useSortable({
    id: direction,
    disabled: true,
    data: {
      type: 'Direction',
      direction,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`c-board__direction --${direction}`}
    >
      <SortableContext items={cardsIds}>
        {cities.map((city, index) => (
          <SelectableCard key={city.id} city={city} />
        ))}
      </SortableContext>
    </div>
  )
}

export default Direction
