import { connect } from 'react-redux'
import { view_gallery } from './index'

export default connect(
  (state) => {
    return {
      likes: state.likes,
    }
  },
  (dispatch) => ({
    likesToggle: (id) => dispatch({ type: 'likes_toggle', id }),
  }),
)(view_gallery)
