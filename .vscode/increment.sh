#!/bin/zsh
path=$1
file="${path}/.env"
dev="${path}/.env.development"
prod="${path}/.env.production"
count=(`/usr/bin/awk -F"=" 'BEGIN{OFS=FS} $1=="BUILD_NUMBER"{ print $2 }' < $dev`)
newCount=(`echo $count | /usr/bin/awk -F'"' '{ print $2+1 }'`)
newCount=\"${newCount}\"
/usr/bin/awk -v a="$newCount" -F"=" 'BEGIN{OFS=FS} $1=="BUILD_NUMBER" {$2=a}1' $file > "${file}.tmp" && /bin/mv "${file}.tmp" $file
/usr/bin/awk -v a="$newCount" -F"=" 'BEGIN{OFS=FS} $1=="BUILD_NUMBER" {$2=a}1' $dev > "${dev}.tmp" && /bin/mv "${dev}.tmp" $dev
/usr/bin/awk -v a="$newCount" -F"=" 'BEGIN{OFS=FS} $1=="BUILD_NUMBER" {$2=a}1' $prod > "${prod}.tmp" && /bin/mv "${prod}.tmp" $prod