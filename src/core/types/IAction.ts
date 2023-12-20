import { StaticImport } from 'next/dist/shared/lib/get-img-props'

export interface IAction {
  id: string
  label: string
  img: StaticImport
  alt: string
  description: string
}
