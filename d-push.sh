namespace="labproj21"
server="default-route-openshift-image-registry.apps.ocp.lab.cloudpak.site/$namespace"
tag="0.0.1"

docker tag "postgres:10.5" "$server/postgres:10.5"
docker push "$server/postgres:10.5"

docker tag "module-chat:$tag" "$server/module-chat:$tag"
docker push "$server/module-chat:$tag"

docker tag "module-base:$tag" "$server/module-base:$tag"
docker push "$server/module-base:$tag"
