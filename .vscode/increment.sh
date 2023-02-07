#!/bin/zsh
path=$1
env="${path}/.env"
dev="${path}/.env.development"
prod="${path}/.env.production"

count=(`/usr/bin/awk -F"=" 'BEGIN{OFS=FS} $1=="BUILD_NUMBER"{ print $2 }' < ${env}`)
count=$((count+1))
newCount=$(/bin/cat $env | /usr/bin/sed -E "s/(.*NUMBER=)([0-9]+)/\1$count/")

echo $newCount > "${env}.tmp" && /bin/mv "${env}.tmp" $env
echo $newCount > "${dev}.tmp" && /bin/mv "${dev}.tmp" $dev
echo $newCount > "${prod}.tmp" && /bin/mv "${prod}.tmp" $prod