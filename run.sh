LIP=$(ipconfig.exe | grep -a -E -o '192\.168\.[0-9]{1,3}\.(([2-9][0-9]{0,2})|([0-9]{2,3}))')
echo Local_ip:${LIP}

cross-env NSFW=false LOCALIP=${LIP} react-native run-android