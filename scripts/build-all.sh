#/bin/sh

if [ -x "$(command -v md5)" ]; then
  EXEC=md5
elif [ -x "$(command -v md5sum)" ];  then
  EXEC=md5sum
else
  echo "cannot generate build hash"
  exit
fi

for app in apps/*/; do
  app=${app#apps/}
  app=${app%*/}
  yarn build $app

  find dist/apps/$app -type f -exec cat {} \; | $EXEC | cut -f1 -d' ' > dist/apps/$app/build.hash

  echo $app":"$(cat dist/apps/$app/build.hash)
done