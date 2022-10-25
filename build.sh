#!/bin/bash

# if there is no changes in plugins
NODE_ENV=production ionic build --prod --release --source-map && npx cap copy

# if there are changes in plugins
NODE_ENV=production ionic build --prod --release --source-map && npx cap sync

#sourcemaps for sentry - remember to chagne releiase verion
#sentry-cli releases files relish-wellbeing-2@2.0 upload-sourcemaps ./www --dist 5
sentry-cli releases files relish-wellbeing-2@<version> upload-sourcemaps ./www --dist <build>

