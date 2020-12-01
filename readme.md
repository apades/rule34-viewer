# rule34-viewer
power by react native

This is a temporary name, will change sometime

The release of version 0.1 may take a while, but you can build with `yarn build`
# features
- Currently only supports rule34
- Add tag/image to like list
- Localized storage like list
- Search and auto complete
# some problems
- ugly UI
- Some unoptimized crash issues
# target
- Support most other websites, like e621 pixiv etc.
- Beautiful UI
- tags update notification
# dev
app dev mode default use proxy by `proxy_server`, you must start app before start proxy_server
# main lib
- ui
    [react-native-paper](https://callstack.github.io/react-native-paper/index.html)
- router
    [React Navigation](https://reactnavigation.org/)
- component
  - viewer
      [react-native-image-viewer](https://github.com/ascoders/react-native-image-viewer)
  - grid-view
      [gridView](https://www.npmjs.com/package/react-native-super-grid)
  - image-view
      [react-native-auto-height-image](https://github.com/vivaxy/react-native-auto-height-image)
