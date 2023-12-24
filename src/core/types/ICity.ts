export interface ICity {
  name: string
  lat: number
  lng: number
  population: number
  country: string
}

export interface ICityFull extends ICity {
  id: string
  direction?: 'left' | 'right' | 'top' | 'bottom'
  isStatic?: boolean
  isFlipped?: boolean
}
