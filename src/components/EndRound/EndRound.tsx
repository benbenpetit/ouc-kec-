import React, { FC, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  invalidCities: number
  onClick: () => void
}

const EndRound: FC<Props> = ({ invalidCities, onClick }) => {
  const [isGuessed, setIsGuessed] = useState(false)
  const [nInput, setNInput] = useState('0')

  return (
    <motion.div className="c-endround">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        exit={{ opacity: 0 }}
        className="c-endround__backdrop"
        onClick={onClick}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0, 1] }}
        exit={{ opacity: 0, y: 20 }}
        className="c-endround__inner"
      >
        {isGuessed ? (
          <div className="c-endround__result">
            <motion.span
              key={'aze'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.4, ease: [0.4, 0, 0, 1] }}
              exit={{ opacity: 0, y: 20 }}
              style={{ color: invalidCities > 0 ? '#ff0000' : '#22c33d' }}
            >
              {invalidCities}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.4, ease: [0.4, 0, 0, 1] }}
              exit={{ opacity: 0, y: 20 }}
            >
              Errors
            </motion.span>
          </div>
        ) : (
          <div className="c-endround__form">
            <motion.span
              key={'bbb'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.4, ease: [0.4, 0, 0, 1] }}
              exit={{ opacity: 0, y: 20 }}
            >
              How many errors did you find ?
            </motion.span>
            <input
              type="text"
              value={nInput}
              onChange={(e) => setNInput(e.target.value)}
            />
            <button
              onClick={() => {
                setIsGuessed(true)
              }}
            >
              Submit
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default EndRound
