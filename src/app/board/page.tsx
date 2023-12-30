'use client'

import Action from '@/components/Actions/Action'
import Card from '@/components/Card/Card'
import SelectableCard from '@/components/Card/SelectableCard'
import Direction from '@/components/Direction'
import CITIES from '@/core/data/constants/cities'
import { IAction } from '@/core/types/IAction'
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
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { v4 as uuid } from 'uuid'
import DuelActionImg from '@/assets/img/actions/duel.png'
import FinishImg from '@/assets/img/actions/finish.png'
import clsx from 'clsx'
import Contest from '@/components/Contest/Contest'
import { AnimatePresence } from 'framer-motion'
import EndRound from '@/components/EndRound/EndRound'

const MAX_ROUNDS = 3

const BASE_ACTIONS: IAction[] = [
  {
    id: 'end-round',
    label: 'End Round',
    img: FinishImg,
    alt: 'Finish line',
    description: 'End round and estimate errors',
  },
  {
    id: 'contest',
    label: 'Contest',
    img: DuelActionImg,
    alt: 'Two swords crossed',
    description: 'Contest a city placement',
  },
]

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t

const BoardPage = () => {
  const [isMounted, setIsMounted] = useState(false)

  const [windowDimensions, setWindowDimensions] = useState({
    width: 1920,
    height: 1080,
  })
  const requestRef = useRef(0)
  const [basePos, setBasePos] = useState({ x: 0, y: 0 })
  const [offsetCursorPos, setOffsetCursorPos] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [lerpMousePos, setLerpMousePos] = useState({ x: 0, y: 0 })
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [lerpZoom, setLerpZoom] = useState(1)

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
  const { leftOffset, topOffset, rightOffset, bottomOffset, width, height } =
    useMemo(() => {
      const leftCards = placedCards.filter((c) => c.direction === 'left')
      const topCards = placedCards.filter((c) => c.direction === 'top')
      const rightCards = placedCards.filter((c) => c.direction === 'right')
      const bottomCards = placedCards.filter((c) => c.direction === 'bottom')

      return {
        leftOffset: leftCards.length * 300,
        topOffset: topCards.length * 200,
        rightOffset: rightCards.length * 300,
        bottomOffset: bottomCards.length * 200,
        width: 400 + (leftCards.length + rightCards.length) * 300,
        height: 300 + (topCards.length + bottomCards.length) * 200,
      }
    }, [placedCards])

  const [actions, setActions] = useState<IAction[]>(BASE_ACTIONS)
  const [isContesting, setIsContesting] = useState(false)
  const [isContestModal, setIsContestModal] = useState(false)
  const [lastPlacedCard, setLastPlacedCard] = useState<ICityFull | null>(null)
  const [contestedCard, setContestedCard] = useState<ICityFull | null>(null)
  const [isContestValid, setIsContestValid] = useState(false)
  const [isEndRoundModal, setIsEndRoundModal] = useState(false)
  const [isFlipCards, setIsFlipCards] = useState(false)
  const [invalidCities, setInvalidCities] = useState(0)

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
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    setOffsetCursorPos({ x: clientX, y: clientY })
    setBasePos(dragPos)
    setIsMouseDown(true)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false)
    }

    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragPos])

  useEffect(() => {
    setMousePos(({ x: prevX, y: prevY }) => ({
      x: Math.min(Math.max(-rightOffset, prevX), leftOffset),
      y: Math.min(Math.max(-bottomOffset, prevY), topOffset),
    }))
  }, [windowDimensions])

  const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      const newPos = {
        x: basePos.x + e.clientX - offsetCursorPos.x,
        y: basePos.y + e.clientY - offsetCursorPos.y,
      }

      setMousePos({
        x: Math.min(Math.max(-rightOffset, newPos.x), leftOffset),
        y: Math.min(Math.max(-bottomOffset, newPos.y), topOffset),
      })
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMouseDown, offsetCursorPos, basePos, windowDimensions])

  useEffect(() => {
    setDragPos({
      x: lerpMousePos.x,
      y: lerpMousePos.y,
    })
  }, [lerpMousePos])

  useEffect(() => {
    const handleRaf = () => {
      setLerpMousePos({
        x: lerp(lerpMousePos.x, mousePos.x, 0.15),
        y: lerp(lerpMousePos.y, mousePos.y, 0.15),
      })

      setLerpZoom(lerp(lerpZoom, zoom, 0.1))

      requestRef.current = requestAnimationFrame(handleRaf)
    }

    requestRef.current = requestAnimationFrame(handleRaf)
    return () => cancelAnimationFrame(requestRef.current)
  }, [lerpMousePos, mousePos, lerpZoom, zoom])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isContestModal) {
        const delta = e.deltaY
        setZoom((prevZoom) =>
          Math.max(Math.min(1.25, prevZoom - delta * 0.001), 0.6)
        )
      }
    }

    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [zoom, topOffset, bottomOffset, leftOffset, rightOffset])

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
      const card = event.active.data.current?.card as ICityFull
      setActiveCard(card)

      // Add Card to placedCards if it's not already there (when dragging from reserve)
      if (!placedCards.find((placedCard) => placedCard.id === card.id)) {
        setPlacedCards((cards) =>
          [...cards, card].map((c) =>
            c.id === card.id ? c : { ...c, isStatic: true }
          )
        )
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
      const activeIndex = placedCards.findIndex((c) => c.id === activeId)
      setPlacedCards((cards) => {
        const overIndex = cards.findIndex((c) => c.id === overId)
        if (cards[activeIndex].direction != cards[overIndex].direction) {
          cards[activeIndex].direction = cards[overIndex].direction
          return arrayMove(cards, activeIndex, overIndex - 1)
        }
        return arrayMove(cards, activeIndex, overIndex)
      })
      setLastPlacedCard(placedCards[activeIndex])
    }

    const isOverADirection = overType === 'Direction'
    if (isActiveACard && isOverADirection) {
      const activeIndex = placedCards.findIndex((c) => c.id === activeId)
      setPlacedCards((cards) => {
        cards[activeIndex].direction = overId as any
        return arrayMove(cards, activeIndex, activeIndex)
      })
      setLastPlacedCard(placedCards[activeIndex])
    }
  }

  const handleEndRound = () => {
    setIsEndRoundModal(true)
    const sortedCards = [
      ...placedCards.filter((c) => c.direction === 'left').reverse(),
      ...placedCards.filter((c) => c.direction === 'right'),
      ...placedCards.filter((c) => c.direction === 'top').reverse(),
      ...placedCards.filter((c) => c.direction === 'bottom'),
    ]

    const invalidCities = sortedCards.reduce((acc, card, index) => {
      const nextCard = sortedCards[index + 1]
      if (!nextCard) return acc

      const axis =
        card.direction === 'left' || card.direction === 'right' ? 'x' : 'y'
      const isInOrder =
        axis === 'x' ? card.lng < nextCard.lng : card.lat > nextCard.lat

      return isInOrder ? acc + 1 : acc
    }, 0)

    setInvalidCities(invalidCities)
  }

  const handleContestClick = (incCard: ICityFull) => {
    if (isContesting) {
      setIsContestModal(true)
      setContestedCard(incCard)

      const axis =
        lastPlacedCard?.direction === 'left' ||
        lastPlacedCard?.direction === 'right'
          ? 'x'
          : 'y'

      const sortedCards = [
        ...placedCards.filter((c) => c.direction === 'left').reverse(),
        ...placedCards.filter((c) => c.direction === 'right'),
        ...placedCards.filter((c) => c.direction === 'top').reverse(),
        ...placedCards.filter((c) => c.direction === 'bottom'),
      ]

      const sortedContest = sortedCards.filter(
        (c) => c.id === lastPlacedCard?.id || c.id === incCard?.id
      )

      const isInOrder =
        axis === 'x'
          ? sortedContest[0].lng < sortedContest[1].lng
          : sortedContest[0].lat > sortedContest[1].lat

      setIsContestValid(!isInOrder)
    }
  }

  const handleContest = () => {
    if (isContesting) {
      setIsContesting(false)
    } else {
      setIsContesting(true)
    }
  }

  const getIsActionnable = (actionId: string) => {
    switch (actionId) {
      case 'contest':
        return (
          placedCards.filter((c) => c?.direction === 'left').length +
            placedCards.filter((c) => c?.direction === 'right').length >=
            2 ||
          placedCards.filter((c) => c?.direction === 'top').length +
            placedCards.filter((c) => c?.direction === 'bottom').length >=
            2
        )
      case 'end-round':
        return reserveCards.length === 0
      default:
        return true
    }
  }

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'contest': {
        handleContest()
        break
      }
      case 'end-round': {
        handleEndRound()
        break
      }
      default:
        return false
    }
  }

  return (
    <main className={clsx(isMouseDown && '--is-grabbing')}>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="c-wrapper">
          <div className="c-wrapper__drag">
            <span
              className="c-wrapper__drag__pointer"
              onMouseDown={handleMouseDown}
            />
            <div
              className="c-wrapper__drag__wrap"
              style={{
                transform: `translate(-50%, -50%) scale(${lerpZoom.toFixed(
                  4
                )})`,
              }}
            >
              <div
                className="c-wrapper__inner c-board"
                style={{
                  transform: `translate3d(${dragPos.x}px, ${dragPos.y}px, 0px)`,
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              >
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
                        onClickCard={(card) => handleContestClick(card)}
                        clickableCards={
                          isContesting
                            ? placedCards.filter(
                                (c) =>
                                  c.id !== lastPlacedCard?.id &&
                                  (lastPlacedCard?.direction === 'left' ||
                                  lastPlacedCard?.direction === 'right'
                                    ? c.direction === 'left' ||
                                      c.direction === 'right'
                                    : c.direction === 'top' ||
                                      c.direction === 'bottom')
                              )
                            : []
                        }
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </div>
          <div className="c-reserve">
            {reserveCards.map((city, index) => (
              <SelectableCard
                key={index}
                city={city}
                disabled={
                  isContesting || (reserveCards.length > 1 && index !== 0)
                }
                isReserveCard
              />
            ))}
          </div>
          <div className="c-actions">
            {actions.map((action) => (
              <Action
                key={action.label}
                action={action}
                onClick={() => handleActionClick(action.id)}
                isDisabled={!getIsActionnable(action.id)}
              />
            ))}
          </div>
        </div>
        {isMounted && (
          <>
            {createPortal(
              <DragOverlay>
                {activeCard && (
                  <SelectableCard city={activeCard} scale={lerpZoom} />
                )}
              </DragOverlay>,
              document.body
            )}
            {createPortal(
              <AnimatePresence>
                {isContestModal && lastPlacedCard && contestedCard && (
                  <Contest
                    cities={[lastPlacedCard, contestedCard]}
                    isContestValid={isContestValid}
                    onClick={() => {
                      setIsContestModal(false)
                      setIsContesting(false)
                      setContestedCard(null)
                    }}
                  />
                )}
              </AnimatePresence>,
              document.body
            )}
            {createPortal(
              <AnimatePresence>
                {isEndRoundModal && (
                  <EndRound
                    invalidCities={invalidCities}
                    onClick={() => {
                      setIsEndRoundModal(false)
                      setPlacedCards((cards) =>
                        cards.map((c) => ({ ...c, isFlipped: true }))
                      )
                    }}
                  />
                )}
              </AnimatePresence>,
              document.body
            )}
          </>
        )}
      </DndContext>
    </main>
  )
}

export default BoardPage
