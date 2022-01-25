kubectl create deployment postgres    --image=image-registry.openshift-image-registry.svc:5000/labproj21/postgres:10.5     --port=5432  --dry-run=client -o yaml > ~/projekt/yaml/d-postgres.yaml
kubectl create deployment module-base --image=image-registry.openshift-image-registry.svc:5000/labproj21/module-base:0.0.1 --port=25600 --dry-run=client -o yaml > ~/projekt/yaml/d-module-base.yaml
kubectl create deployment module-chat --image=image-registry.openshift-image-registry.svc:5000/labproj21/module-chat:0.0.1 --port=25601 --dry-run=client -o yaml > ~/projekt/yaml/d-module-chat.yaml

kubectl apply -f d-module-base.yaml
kubectl apply -f d-module-chat.yaml
