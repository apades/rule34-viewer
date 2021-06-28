import React from 'react'
import { LogBox } from 'react-native'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import AppRouter from './AppRouter'
import Toast from 'react-native-toast-message'
import store from './reducers/index'
import { _logBox } from './utils/utils'

LogBox.ignoreLogs(['Remote debugger'])
_logBox.disable([''])

let theme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}
function App(): JSX.Element {
  return (
    <>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <AppRouter />
        </PaperProvider>
      </Provider>
      <Toast style={{ zIndex: 10000 }} ref={(ref) => Toast.setRef(ref)} />
    </>
  )
}

export default App
