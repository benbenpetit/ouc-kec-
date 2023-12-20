import { IAction } from '@/core/types/IAction'
import clsx from 'clsx'
import Image from 'next/image'
import React, { FC } from 'react'

interface Props {
  action: IAction
  isDisabled?: boolean
  onClick: () => void
}

const Action: FC<Props> = ({ action, isDisabled, onClick }) => {
  const { label, img, alt, description } = action

  return (
    <button
      aria-description={description}
      className={clsx('c-action', isDisabled && '--disabled')}
      onClick={() => !isDisabled && onClick()}
      disabled={isDisabled}
    >
      <Image src={img} alt={alt} width={32} height={32} draggable={false} />
      <span>{label}</span>
    </button>
  )
}

export default Action
