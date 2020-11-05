import { connect } from 'react-redux'
import dom from './dom'

export default connect(
  (state) => {
    return {}
  },
  (dispatch) => ({
    likesToggle: (id) => dispatch({ type: 'likes_toggle', id }),
  }),
)(dom)
