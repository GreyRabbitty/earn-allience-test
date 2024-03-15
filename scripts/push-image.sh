#/bin/sh

APP=$1
IMAGE=gcr.io/trim-glazing-335013/app-backend-ea/$APP:latest

echo "Building image for $APP"
docker build --platform=linux/amd64 -t $IMAGE --build-arg APP=$APP .

echo "Pushing image to $IMAGE"
docker push $IMAGE
