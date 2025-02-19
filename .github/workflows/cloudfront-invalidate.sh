#!/bin/sh

id=$(aws cloudfront create-invalidation \
--distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" \
--paths '/*' | jq '.Invalidation.Id' -r)

if [ "$id" = "" ]
then
    echo "Unable to create invalidation"
    exit 1
fi

status=

while [ "$status" != Completed ]
do
    echo "Waiting for cache invalidation"
    sleep 10

    status=$(aws cloudfront get-invalidation \
    --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" \
    --id "$id" | jq '.Invalidation.Status' -r)

    if [ "$status" = "" ]
    then
        echo "Unable to get invalidation"
        exit 1
    fi
done

exit 0