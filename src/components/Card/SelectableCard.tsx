import Card from '@/components/Card/Card'
import { ICityFull } from '@/core/types/ICity'
import { useSortable } from '@dnd-kit/sortable'
import { CSSProperties, FC, useEffect } from 'react'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'

interface Props {
  city: ICityFull
  disabled?: boolean
  isReserveCard?: boolean
  scale?: number
}

const SelectableCard: FC<Props> = ({
  city,
  disabled,
  isReserveCard,
  scale = 1,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: city.id,
    disabled,
    data: {
      type: isReserveCard ? 'Card__Reserve' : 'Card',
      card: city,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString({
      ...transform,
      scaleX: scale,
      scaleY: scale,
    } as any),
  }

  return (
    <div
      className={clsx(
        'c-selectable-card',
        isDragging && !isReserveCard && '--is-dragging'
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card city={city} />
    </div>
  )
}

export default SelectableCard
