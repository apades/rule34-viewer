import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dispatch } from 'react'
import { RootActions, StateBase } from 'reducers'

export const loadRules = () => (
  dispatch: Dispatch<RootActions>,
  getState: () => StateBase,
): Promise<void> => {
  if (getState().setting.loaded) return Promise.resolve()
  return AsyncStorage.getItem('rules')
    .then((res) => {
      dispatch({ type: 'setting/loadRules', rules: JSON.stringify(res) as any })
    })
    .catch((err) => console.error('loadRules', err))
}

export const addRule = (rule: any) => (
  dispatch: Dispatch<RootActions>,
  getState: () => StateBase,
): Promise<void> => {
  let state = getState()
  let rules = [...state.setting.rules, rule]

  return AsyncStorage.setItem('rules', JSON.stringify(rules))
    .then(() => {
      dispatch({ type: 'setting/loadRules', rules })
    })
    .catch((err) => console.error('addRule', err))
}

export const setRule = (rule: any) => (
  dispatch: Dispatch<RootActions>,
  getState: () => StateBase,
): Promise<void> => {
  let state = getState()
  let rules = [...state.setting.rules, rule]

  return AsyncStorage.setItem('rules', JSON.stringify(rules))
    .then(() => {
      dispatch({ type: 'setting/setRule', rule })
    })
    .catch((err) => console.error('addRule', err))
}
