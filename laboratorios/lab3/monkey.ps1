# Definir el nombre del deployment y el namespace
$deploymentName = "echo-deployment"
$namespace = "default"

# Bucle infinito para eliminar un pod cada segundo
while ($true) {
    # Obtener la lista de pods del deployment
    $pods = kubectl get pods -l app=$deploymentName -n $namespace -o jsonpath="{.items[*].metadata.name}"

    # Convertir la lista de pods en un array
    $podArray = $pods -split " "

    # Verificar si hay pods disponibles
    if ($podArray.Length -gt 0) {
        # Seleccionar un pod al azar
        $randomPod = Get-Random -InputObject $podArray

        # Eliminar el pod seleccionado
        kubectl delete pod $randomPod -n $namespace

        # Imprimir el nombre del pod eliminado
        Write-Host "Pod eliminado: $randomPod"
    }
    else {
        Write-Host "No hay pods disponibles para eliminar"
    }

    # Esperar un segundo
    Start-Sleep -Seconds 1
}
