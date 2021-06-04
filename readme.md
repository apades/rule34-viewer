# rule34-viewer
power by **react native**

This is a temporary name, will change sometime

The release of version 1.1-alpha is publish, only support Android now because it have to run some dynamic js code.
# features
- Currently  supports rule34, e621
- Some customize js rule to crawl web data & show it
- Add tag/image to like list
-  <del>Localized storage like list , (rewrting to local sql type)</del>
- Search and auto complete
- Volume button to up/down viewer page
- Save image to external storage
# some problems
- ugly UI
- Some unoptimized crash issues
# target
- Support real customize js rule
- Beautiful UI
- tags update notification
# dev
run `yarn dev_origin`
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
