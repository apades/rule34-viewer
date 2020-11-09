import { connect } from 'react-redux'
import dom from './dom'

var Gallery = connect(
  (state) => {
    return {}
  },
  (dispatch) => ({
    likesToggle: (id) => dispatch({ type: 'likes/img_toggle', id }),
    resetImgList: () => dispatch({ type: 'imgList/reset' }),
    pushImgList: (data) =>
      dispatch({
        type: 'imgList/push',
        dataList: data.dataList,
        count: data.count,
      }),
  }),
)(dom)

export default Gallery
