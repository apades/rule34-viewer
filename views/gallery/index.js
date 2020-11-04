import { connect } from 'react-redux'
import dom from './dom'

export default connect(
  (state) => {
    return {
      likes: state.likes,
    }
  },
  (dispatch) => ({
    likesToggle: (id) => dispatch({ type: 'likes_toggle', id }),
  }),
)(dom)
