import { combineReducers, createStore } from 'redux'
// import imgList from './imgList'
import likes, { LikesAction, LikesDstate } from './likes'
import search, { SearchAction, SearchDstate } from './search'
import setting, { SettingAction, SettingDstate } from './setting'

export default createStore(
  combineReducers({
    likes,
    // imgList,
    search,
    setting,
  }),
)

export type StateBase = {
  likes: LikesDstate
  search: SearchDstate
  setting: SettingDstate
}
export type RootActions = LikesAction | SearchAction | SettingAction
