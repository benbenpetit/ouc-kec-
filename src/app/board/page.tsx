'use client'

import Card from '@/components/Card/Card'
import CITIES from '@/core/data/constants/cities'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

const BoardPage = () => {
  const [round, setRound] = useState(0)
  const shuffledCities = CITIES.sort(() => 0.5 - Math.random())
    .slice(0, 46)
    .map((city) => ({
      ...city,
      id: uuid(),
    }))
  const deck = [
    shuffledCities.slice(0, 15),
    shuffledCities.slice(15, 30),
    shuffledCities.slice(30, 45),
  ]
  const startCity = shuffledCities[45]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  )

  const onDragStart = () => {
    console.log('onDragStart')
  }

  const onDragEnd = () => {
    console.log('onDragEnd')
  }

  const onDragOver = () => {
    console.log('onDragOver')
  }

  return (
    <main>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="c-board">
          <div className="c-board__center">
            <div className="c-board__center-card">
              <Card city={startCity} />
            </div>
            {/* <SortableContext items={cardsLeftIds.concat(cardsRightIds)}>
              <div className="c-board__direction --left">
                {cardsLeft.map((city, index) => (
                  <Card key={index} city={city} />
                ))}
              </div>
            </SortableContext>
            <div className="c-board__direction --right">
              {cardsRight.map((city, index) => (
                <Card key={index} city={city} />
              ))}
            </div>
            <SortableContext items={cardsTopIds.concat(cardsBottomIds)}>
              <div className="c-board__direction --top">
                {cardsTop.map((city, index) => (
                  <Card key={index} city={city} />
                ))}
              </div>
              <div className="c-board__direction --bottom">
                {cardsBottom.map((city, index) => (
                  <Card key={index} city={city} />
                ))}
              </div>
            </SortableContext> */}
          </div>
        </div>
      </DndContext>
    </main>
  )
}

export default BoardPage
