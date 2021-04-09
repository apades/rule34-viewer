import { GalleryItem } from 'types/itemType'
import { Dp, GetState } from 'types/redux'

export const likeToggle = (data: GalleryItem) => async (
  dispatch: Dp,
  getState: GetState,
): Promise<void> => {
  let state = getState()
  console.log(state)

  dispatch({ type: 'likes/img_toggle', id: data.id, data })
}
