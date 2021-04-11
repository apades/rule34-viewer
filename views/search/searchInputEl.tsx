import { useDp, useNav } from '@r/hooks'
import React, { FC } from 'react'
import Comp_seachInput from '../../components/searchInput'

type Props = {
  setText: React.Dispatch<React.SetStateAction<string>>
  text: string
}
let SearchInputEl: FC<Props> = (props) => {
  let { setText, text } = props
  let navigation = useNav<'search'>()
  let dispatch = useDp()

  return (
    <Comp_seachInput
      autoFocus={true}
      onChangeText={(text) => {
        setText(text)
      }}
      onSubmitEditing={(tags) => {
        dispatch({ type: 'search/addHis', value: text })
        navigation.replace('gallery', { tags })
      }}
      value={text}
    />
  )
}

export default SearchInputEl
