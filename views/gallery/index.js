import { connect } from 'react-redux'
import dom from './dom'

var Gallery = connect(
  (state) => {
    return {
      imgDataList: state.imgList.dataList,
    }
  },
  (dispatch) => ({
    likesToggle: (id) => dispatch({ type: 'likes/img_toggle', id }),
    resetImgList: () => dispatch({ type: 'imgList/reset' }),
    pushImgList: (data) =>
      dispatch({
        type: 'imgList/push',
        ...data,
      }),
  }),
)(dom)

export default Gallery
