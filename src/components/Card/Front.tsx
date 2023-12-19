import Image from 'next/image'
import { FC } from 'react'
import FrontImg from '@/assets/img/card-front.jpg'

interface Props {
  name: string
}

const Front: FC<Props> = ({ name }) => {
  return (
    <div className="c-front">
      <Image
        className="c-card__inside__image"
        src={FrontImg}
        alt="Ville"
        draggable={false}
      />
      <div className="c-front__sign">
        <span>{name}</span>
      </div>
    </div>
  )
}

export default Front
