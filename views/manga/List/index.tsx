import getRuleResult from '@r/package/ruleParser'
import { StateBase } from '@r/reducers'
import React, { FC, memo, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import Manga_ListItem from './Item'

export type ListProps = {
  //
}
type rProps = ConnectedProps<typeof connector> & ListProps
let Manga_List: FC<rProps> = (props) => {
  let [dataList, setdataList] = useState<any[]>([])

  useEffect(() => {
    getRuleResult('discover.list', {
      pageLimit: 10,
      pageNum: 0,
      searchString: '',
    }).then((res) => {
      console.log(res)
      setdataList(res)
    })
  }, [])
  return (
    <View>
      <ScrollView>
        {dataList.map((d) => (
          <Manga_ListItem data={d} key={d.id} />
        ))}
      </ScrollView>
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {}
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Manga_List))
