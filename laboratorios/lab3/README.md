## Ingeniería del caos

La ingeniería del caos es una disciplina que busca mejorar la resiliencia y fiabilidad de los sistemas informáticos mediante la introducción deliberada de fallas en un entorno controlado. Este enfoque ayuda a identificar vulnerabilidades antes de que causen problemas reales.


### prerequisitos
- docker desktop instalado
- kubernetes habilitado
- instalar metrics server, hacerlo con el siguiente comando:
```bash
kubectl apply -f metric-server.yml
```

### Primera parte: Self healing
pasos:

desplegar una aplicacion con 3 replicas

```bash
kubectl create -f echo-deployment.yml
```
verificar la creación con el siguiente comando
```bash
kubectl get deployments
```
```bash
kubectl get pods
```

exponemos el deployment con el siguiente comando:
```bash
kubectl expose deployment echo-deployment --type=LoadBalancer --port=8080
```
verificamos el servicio creado con el siguiente comando:
```bash
kubectl get services
```

verificamos la conexión desde un navegador vistando localhost:8080, la respuesta debería ser similar a:
```bash
Welcome to echo-server!  Here's what I know.
  > Head to /ws for interactive websocket echo!

-> My hostname is: echo-deployment-6d6b8cd999-zvj56

-> Requesting IP: 192.168.65.3:53198

-> Request Headers |

  HTTP/1.1 GET /

  Host: localhost:8080
  Accept-Encoding: gzip, deflate, br
  Accept-Language: es-ES,es;q=0.9,en;q=0.8
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
  Connection: keep-alive
  Cookie: csrftoken=kev770VN7aY9mKsZxvO6brXy0Uu2DohX; grafana_session=13361543f9e6430dc413b1080f659905; grafana_session_expiry=1700668840
  Referer: http://localhost:8089/
  Sec-Ch-Ua-Mobile: ?0
  Sec-Ch-Ua-Platform: "Windows"
  Sec-Ch-Ua: "Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"
  Sec-Fetch-Dest: document
  Sec-Fetch-Mode: navigate
  Sec-Fetch-Site: same-site
  Sec-Fetch-User: ?1
  Upgrade-Insecure-Requests: 1
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36

```
ahora lo que debemos hacer en una nueva ventana es ejecutar el script de powershell  ***monkey.ps1*** que elimina de manera aleatoria los pods del deployment echo-deployment

```bash
./monkey.ps1
```
podemos ver el comportamiento del cluster en la ventana de docker, tambien podemos ver el resultado en la consola de powershell donde se ejecutó el script, el resultado debe ser algo similar a:
```bash
Pod eliminado: echo-deployment-6d6b8cd999-5gdm9
pod "echo-deployment-6d6b8cd999-96pl2" deleted
Pod eliminado: echo-deployment-6d6b8cd999-96pl2
pod "echo-deployment-6d6b8cd999-lhl4m" deleted
Pod eliminado: echo-deployment-6d6b8cd999-lhl4m
pod "echo-deployment-6d6b8cd999-tpj9t" deleted
Pod eliminado: echo-deployment-6d6b8cd999-tpj9t
pod "echo-deployment-6d6b8cd999-2884w" deleted
Pod eliminado: echo-deployment-6d6b8cd999-2884w
pod "echo-deployment-6d6b8cd999-qjrgw" deleted
Pod eliminado: echo-deployment-6d6b8cd999-qjrgw
pod "echo-deployment-6d6b8cd999-74btz" deleted
Pod eliminado: echo-deployment-6d6b8cd999-74btz
pod "echo-deployment-6d6b8cd999-rwg76" deleted
Pod eliminado: echo-deployment-6d6b8cd999-rwg76
pod "echo-deployment-6d6b8cd999-6h554" deleted
Pod eliminado: echo-deployment-6d6b8cd999-6h554
pod "echo-deployment-6d6b8cd999-4xf82" deleted
Pod eliminado: echo-deployment-6d6b8cd999-4xf82
pod "echo-deployment-6d6b8cd999-ldhnc" deleted
Pod eliminado: echo-deployment-6d6b8cd999-ldhnc
pod "echo-deployment-6d6b8cd999-qq7d6" deleted
```
Ejecutar el archivo docker-compose.yml que se encuentra dentro de la carpeta locust con el comando docker-compose, luego visitar la página localhost:8089, en la pantalla start new load test
configarlo con los siguientes valores

Number of users: 100
spawn rate: 1
host: <tu ip>:8080


### Segunda parte: Autoscaling

habilitamos el autoscaling de nuestros pods con la siguiente configuración
```bash
kubectl autoscale deployment echo-deployment --min=3 --max=10 --cpu-percent=50
```

ejecutamos un nuevo test desde locust cambiando los valores

Number of users: 10000
spawn rate: 100
host: <tu ip>:8080

![locust](img/1.png)


