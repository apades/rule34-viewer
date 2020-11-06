import { connect } from 'react-redux'
import dom from './dom'

var Gallery = connect(
  (state) => {
    return {}
  },
  (dispatch) => ({
    likesToggle: (id) => dispatch({ type: 'likes/img_toggle', id }),
  }),
)(dom)

export default Gallery
