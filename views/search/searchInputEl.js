import React from 'react'
import { connect } from 'react-redux'
import { Comp_seachInput } from '../../components/searchInput'

let SearchInputEl = connect((state) => ({}))(
  ({ navigation, setText, text, dispatch }) => {
    return (
      <Comp_seachInput
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
  },
)

export default SearchInputEl
