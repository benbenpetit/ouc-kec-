'use client'

import Card from '@/components/Card/Card'
import SelectableCard from '@/components/Card/SelectableCard'
import Direction from '@/components/Direction'
import CITIES from '@/core/data/constants/cities'
import { ICity, ICityFull } from '@/core/types/ICity'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { v4 as uuid } from 'uuid'

const MAX_ROUNDS = 3

const BoardPage = () => {
  const [round, setRound] = useState(0)
  const [startCity, setStartCity] = useState<ICity | null>(null)
  const [deck, setDeck] = useState<ICityFull[][]>([[]])
  const [reserveCards, setReserveCards] = useState<ICityFull[]>([])
  const [placedCards, setPlacedCards] = useState<ICityFull[]>([])

  const [directions, setDirections] = useState<
    ('left' | 'right' | 'top' | 'bottom')[]
  >(['left', 'right', 'top', 'bottom'])
  const directionsIds = useMemo(
    () => directions.map((direction) => direction),
    [directions]
  )

  const [activeCard, setActiveCard] = useState<ICityFull | null>(null)

  useEffect(() => {
    if (round === MAX_ROUNDS) return
    setReserveCards(deck[round])
  }, [deck, round])

  useEffect(() => {
    const shuffledCities = CITIES.sort(() => 0.5 - Math.random())
      .slice(0, 46)
      .map((city) => ({
        ...city,
        id: uuid(),
        direction: undefined,
      }))

    setDeck([
      shuffledCities.slice(0, 15),
      shuffledCities.slice(15, 30),
      shuffledCities.slice(30, 45),
    ])
    setStartCity(shuffledCities[45])
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  )

  const onDragStart = (event: DragStartEvent) => {
    setActiveCard(null)

    const type = event.active.data.current?.type
    if (type === 'Card' || type === 'Card__Reserve') {
      const card = event.active.data.current?.card
      setActiveCard(card)

      // Add Card to placedCards if it's not already there (when dragging from reserve)
      if (!placedCards.find((placedCard) => placedCard.id === card.id)) {
        setPlacedCards((cards) => [...cards, card])
      }
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active } = event
    const isCardFromReserve = active.id === reserveCards[0]?.id

    if (isCardFromReserve) {
      const cardFromReservePlaced = placedCards.find((c) => c.id === active.id)
      if (cardFromReservePlaced?.direction) {
        setReserveCards((cards) => cards.slice(1))
      } else {
        setPlacedCards((placedCards) =>
          placedCards.filter((card) => card.id !== active.id)
        )
      }
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id
    if (activeId === overId) return

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    const isActiveACard =
      activeType === 'Card' || activeType === 'Card__Reserve'
    const isOverACard = overType === 'Card'
    if (!isActiveACard) return
    if (isActiveACard && isOverACard) {
      setPlacedCards((cards) => {
        const activeIndex = cards.findIndex((c) => c.id === activeId)
        const overIndex = cards.findIndex((c) => c.id === overId)
        if (cards[activeIndex].direction != cards[overIndex].direction) {
          cards[activeIndex].direction = cards[overIndex].direction
          return arrayMove(cards, activeIndex, overIndex - 1)
        }
        return arrayMove(cards, activeIndex, overIndex)
      })
    }

    const isOverADirection = overType === 'Direction'
    if (isActiveACard && isOverADirection) {
      setPlacedCards((cards) => {
        const activeIndex = cards.findIndex((c) => c.id === activeId)
        cards[activeIndex].direction = overId as any
        return arrayMove(cards, activeIndex, activeIndex)
      })
    }
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
            <div className="c-board__center__card">
              {startCity && <Card city={startCity} />}
            </div>
            <SortableContext items={directionsIds}>
              {directions.map((direction) => (
                <Direction
                  key={direction}
                  direction={direction}
                  cities={placedCards.filter(
                    (city) => city.direction === direction
                  )}
                />
              ))}
            </SortableContext>
          </div>
          <div className="c-board__reserve">
            {reserveCards.map((city, index) => (
              <SelectableCard
                key={index}
                city={city}
                disabled={reserveCards.length > 1 && index !== 0}
                isReserveCard
              />
            ))}
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeCard && <SelectableCard city={activeCard} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </main>
  )
}

export default BoardPage
