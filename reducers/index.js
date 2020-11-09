import { combineReducers } from 'redux'
import imgList from './imgList'
import likes from './likes'

export default combineReducers({
  likes,
  imgList,
})
