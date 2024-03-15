#/bin/sh

APP=$1
if [ -x "$(command -v md5)" ]; then
  EXEC=md5
elif [ -x "$(command -v md5sum)" ];  then
  EXEC=md5sum
else
  echo "cannot generate build hash"
  exit
fi

yarn build $APP

find dist/apps/$APP -type f -exec cat {} \; | $EXEC | cut -f1 -d' ' > dist/apps/$APP/build.hash

echo "Build:" $(cat dist/apps/$APP/build.hash)