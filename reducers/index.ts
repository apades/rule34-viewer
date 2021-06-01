import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import likes, { LikesAction, LikesDstate } from './likes'
import search, { SearchAction, SearchDstate } from './search'
import setting, { SettingAction, SettingDstate } from './setting'

let rootReducer = combineReducers({
  likes,
  search,
  setting,
})
let store = (function configureStore() {
  const middlewares = [thunkMiddleware]
  const composeEnhancers = composeWithDevTools(applyMiddleware(...middlewares))

  const store = createStore(rootReducer, composeEnhancers)

  return store
})()

export default store

export type StateBase = {
  likes: LikesDstate
  search: SearchDstate
  setting: SettingDstate
}
export type RootActions = LikesAction | SearchAction | SettingAction
