import { RootStackParamList } from '@r/AppRouter'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

export type RootPageProps<K extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, K>
  navigation: StackNavigationProp<RootStackParamList, K>
}
