import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getCache(key: string): Promise<string> {
  return await AsyncStorage.getItem(key)
}

export async function setCache(key: string, value: string): Promise<void> {
  return await AsyncStorage.setItem(key, value)
}
