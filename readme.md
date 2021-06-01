# rule34-viewer
power by **react native**

This is a temporary name, will change sometime

The release of version 0.1 may take a while, but you can build with `yarn build`
# features
- Currently  supports rule34, e621
- Some customize rule to crawl web data & show it
- Add tag/image to like list
-  <del>Localized storage like list , (rewrting to local sql type)</del>
- Search and auto complete
# some problems
- ugly UI
- Some unoptimized crash issues
# target
- Support most other websites, like pixiv etc.
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
