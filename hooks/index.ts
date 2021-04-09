import { Dp } from '@r/types/redux'
import { useDispatch } from 'react-redux'

export const useDp = (): Dp => useDispatch<Dp>()
