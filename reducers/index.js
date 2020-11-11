import { combineReducers } from 'redux'
import imgList from './imgList'
import likes from './likes'
import search from './search'

export default combineReducers({
  likes,
  imgList,
  search,
})
