import { omitOjbect } from '@r/utils/utils'
import { PartialRoute, Route } from '@react-navigation/routers'

export type StateDstate = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  lastRouter: PartialRoute<Route<string, object>>
}
let init: StateDstate = {
  lastRouter: null,
}

export type StateAction = StateSet

type StateSet = {
  type: 'state/set'
} & {
  [k in keyof StateDstate]?: StateDstate[k]
}

const state = (state = init, action: StateAction): StateDstate => {
  switch (action.type) {
    case 'state/set': {
      let data = omitOjbect(action, ['type'])
      Object.assign(state, data)
      return { ...state }
    }
    default:
      return state
  }
}

export default state
