BASEDIR=$(dirname $0)/..

for APPDIR in $BASEDIR/apps/* ; do
  APP=`echo $APPDIR | rev | cut -d/ -f1 | rev`

  if [ `find $APPDIR -type f -name main.ts` ]; then
    bash $BASEDIR/scripts/push-image.sh $APP
  fi
done