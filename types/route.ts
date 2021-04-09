import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from 'App'

export type RootPageProps<K extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, K>
  navigation: StackNavigationProp<RootStackParamList, K>
}
