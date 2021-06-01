import { StateBase, RootActions } from '../reducers'
import { Dispatch } from 'redux'

export type GetState = () => StateBase
export type Dp = Dispatch<RootActions>
