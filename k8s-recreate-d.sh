concreteModule=$1


if [ "$concreteModule" == "db" ]; then
  {
    kubectl delete deploy postgres
  }
  {
    kubectl delete pvc projekt-pvc-postgres
  }
else
  {
    kubectl delete deploy module-base
  }
  {
    kubectl delete deploy module-chat
  }
fi


if [ "$concreteModule" == "db" ]; then
  kubectl apply -f ./k8s/pvc-postgres.yaml
  kubectl apply -f ./k8s/cm-postgres.yaml
  kubectl apply -f ./k8s/svc-postgres.yaml
  kubectl apply -f ./k8s/d-postgres.yaml
else
  kubectl apply -f ./k8s/cm-module-base.yaml
  kubectl apply -f ./k8s/svc-module-base.yaml
  kubectl apply -f ./k8s/d-module-base.yaml

  kubectl apply -f ./k8s/cm-module-chat.yaml
  kubectl apply -f ./k8s/svc-module-chat.yaml
  kubectl apply -f ./k8s/d-module-chat.yaml
fi
