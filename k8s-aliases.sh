klogs() {
  kubectl logs $(kubectl get pods | grep "$1" | head -1 | cut -d " " -f 1)
}

alias k="kubectl"
alias kdeps="kubectl get deployment"
alias kpods="kubectl get pods"
