#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

if [[ "${TRAVIS_EVENT_TYPE}" == "push" ]];
then
    TAG_NPM=latest
    if [[ $TRAVIS_BRANCH == "develop" ]];
    then
        TAG_NPM=alpha
        if [[ $TRAVIS_EVENT_TYPE == "cron" ]];
        then
            TAG_NPM=beta
        fi
    fi

    echo "Publishing on npm with tag $TAG_NPM"
    npx @alfresco/adf-cli npm-publish --npmRegistry $NPM_REGISTRY_ADDRESS --tokenRegistry $NPM_REGISTRY_TOKEN --tag $TAG_NPM --pathProject "$(pwd)"
else
     echo "PR No need to release in NPM"
fi;
