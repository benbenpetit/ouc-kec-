import React, { FC } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/Card/Card'
import { ICity } from '@/core/types/ICity'
import ContestMap from '@/components/Contest/ContestMap'

interface Props {
  cities: ICity[]
}

const Contest: FC<Props> = ({ cities }) => {
  return (
    <motion.div className="c-contest">
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
      </motion.div>
    </motion.div>
  )
}

export default Contest
