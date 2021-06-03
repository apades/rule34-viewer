import React from 'react'
import { LogBox } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import AppRouter from './AppRouter'
import store from './reducers/index'

LogBox.ignoreLogs(['Remote debugger'])

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AppRouter />
      </PaperProvider>
    </Provider>
  )
}

export default App
