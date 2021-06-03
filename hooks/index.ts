import { RootStackParamList } from '@r/AppRouter'
import { Dp } from '@r/types/redux'
import { RootPageProps } from '@r/types/route'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'

export const useDp = (): Dp => useDispatch<Dp>()
export function useNav<
  K extends keyof RootStackParamList,
>(): StackNavigationProp<RootStackParamList, K> {
  return useNavigation<RootPageProps<K>['navigation']>()
}
