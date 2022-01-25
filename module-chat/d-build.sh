name="module-chat"
tag="0.0.1"

reldir=`dirname $0`
cd $reldir
scriptDir=`pwd`

docker build -t "$name:$tag" $scriptDir
