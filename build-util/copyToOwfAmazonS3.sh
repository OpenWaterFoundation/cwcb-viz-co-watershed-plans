#!/bin/sh
#
# Copy the ../site/* contents to the viz.openwaterfoundation.org website
# - replace all the files on the web with local files
# - location is viz.openwaterfoundation.org/co/cwcb-viz-co-watershed-plans
# - must specify Amazon profile

# Set --dryrun to test before actually doing
dryrun=""
#dryrun="--dryrun"
s3Folder="s3://viz.openwaterfoundation.org/co/cwcb-viz-co-watershed-plans"

if [ "$1" == "" ]
	then
	echo ""
	echo "Usage:  $0 AmazonConfigProfile"
	echo ""
	echo "Copy the site files to the Amazon S3 static website folder:  $s3Folder"
	echo ""
	exit 0
fi

awsProfile="$1"

# Sync the local files up to Amazon S3
aws s3 sync ../site ${s3Folder} ${dryrun} --delete --profile "$awsProfile"
