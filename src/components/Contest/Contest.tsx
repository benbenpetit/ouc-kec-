import React, { FC } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/Card/Card'
import { ICity } from '@/core/types/ICity'
import ContestMap from '@/components/Contest/ContestMap'
import clsx from 'clsx'

interface Props {
  cities: ICity[]
  isContestValid?: boolean
  onClick: () => void
}

const Contest: FC<Props> = ({ cities, isContestValid, onClick }) => {
  return (
    <motion.div className="c-contest" onClick={onClick}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        exit={{ opacity: 0 }}
        className="c-contest__backdrop"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0, 1] }}
        exit={{ opacity: 0, y: 20 }}
        className="c-contest__inner"
      >
        <ContestMap cities={cities} />
        <div
          className={clsx(
            'c-contest__result',
            isContestValid ? '--is-valid' : '--is-invalid'
          )}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.4, ease: [0.4, 0, 0, 1] }}
            exit={{ opacity: 0, y: 20 }}
          >
            {isContestValid
              ? 'The cities are indeed in the wrong position ! Well guessed'
              : 'Unfortunately, the cities are not in the wrong position...'}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Contest
