### Alta disponibilidad y tolerancia a fallos con mongoDB

Crear y gestionar un conjunto de réplicas con múltiples nodos en MongoDB es una manera efectiva de garantizar la alta disponibilidad y la tolerancia a fallos. Aquí te proporciono una guía simplificada para configurar un conjunto de réplicas de MongoDB con Docker Compose:

### Pre-requisitos
- Docker y Docker Compose instalados.
- Conocimientos básicos de Docker y MongoDB.

### Paso 1: Configurar el Archivo `docker-compose.yml`
Crea un archivo `docker-compose.yml` con la siguiente configuración para definir tres nodos de MongoDB:

```yaml
version: '3.8'

services:
  mongo-node-1:
    image: mongo
    command: mongod --replSet rs0 --bind_ip_all
    volumes:
      - mongo-node-1:/data/db
    networks:
      - mongo-network
    ports:
      - "27017:27017"

  mongo-node-2:
    image: mongo
    command: mongod --replSet rs0 --bind_ip_all
    volumes:
      - mongo-node-2:/data/db
    networks:
      - mongo-network
    ports:
      - "27018:27017"

  mongo-node-3:
    image: mongo
    command: mongod --replSet rs0 --bind_ip_all
    volumes:
      - mongo-node-3:/data/db
    networks:
      - mongo-network
    ports:
      - "27019:27017"

networks:
  mongo-network:
    driver: bridge

volumes:
  mongo-node-1:
  mongo-node-2:
  mongo-node-3:
```

### Paso 2: Iniciar el Conjunto de Réplicas
Ejecuta `docker-compose up -d` para iniciar los contenedores de MongoDB.

### Paso 3: Configurar el Conjunto de Réplicas
Conéctate al nodo principal y configura el conjunto de réplicas:

1. Conéctate al primer nodo:
   ```bash
   docker exec -it mongo-node-1 mongosh
   ```

2. Inicializa el conjunto de réplicas:
   ```javascript
   rs.initiate({
     _id: 'rs0',
     members: [
       { _id: 0, host: 'mongo-node-1:27017' },
       { _id: 1, host: 'mongo-node-2:27017' },
       { _id: 2, host: 'mongo-node-3:27017' }
     ]
   })
   ```

### Paso 4: Verificar el Estado del Conjunto de Réplicas
Usa el comando `rs.status()` para verificar el estado y asegurarte de que el conjunto de réplicas está funcionando correctamente.


### Inserción de datos

Usaremos el siguiente script para insertar una cantidad enorme de datos
```bash
docker exec -it lab2-mongo-node-1-1 mongosh
```
```bash
// Conéctate a la base de datos deseada
use mydatabase;

// Función para generar un documento aleatorio
function crearDocumentoAleatorio() {
  return {
    numero: Math.floor(Math.random() * 1000000),
    fecha: new Date(),
    texto: 'Texto aleatorio ' + Math.random().toString(36).substring(7),
    valorBooleano: Math.random() >= 0.5
  };
}

// Número de documentos a insertar
const NUMERO_DOCUMENTOS = 100;

// Insertar documentos en la colección
for (let i = 0; i < NUMERO_DOCUMENTOS; i++) {
  db.miColeccion.insert(crearDocumentoAleatorio());
}

print('Inserción completada');

```

### verificar colección en el nodo slave
Por defecto al seleccionar la base de datos con use mydatabase y ejecutar  db.miColeccion.find(); tendremos el siguiente error:
```shell
rs0 [direct: secondary] mydatabase> db.miColeccion.find();
MongoServerError: not primary and secondaryOk=false - consider using db.getMongo().setReadPref() or readPreference in the connection string
```
esto es porque el nodo no esta habilitado para lectura de datos, por lo que se debe habilitar con

```bash
db.getMongo().setReadPref('secondaryPreferred');
```
Este comando configura la sesión del shell para que prefiera leer desde un nodo secundario, pero leerá desde el primario si no hay secundarios disponibles.


### Gestión de Alta Disponibilidad

- **Elección de Nodo Primario:** En caso de fallo del nodo primario, los nodos secundarios realizarán automáticamente una elección para designar un nuevo primario.
- **Reconexión de Nodo Primario:** Si el nodo primario original se desconecta y luego se reconecta, se reintegrará al conjunto de réplicas como un nodo secundario y se sincronizará automáticamente.
- **Reelección Opcional:** Dependiendo de la configuración, el nodo primario original puede ser reelegido como primario tras la sincronización.

### Consideraciones Adicionales

**Consistencia de Datos**: Leer desde los nodos secundarios puede dar lugar a obtener datos ligeramente desactualizados debido a la latencia de replicación. Esto es importante tener en cuenta si tu aplicación requiere datos en tiempo real o muy recientes.
**Carga de Trabajo:** Usar nodos secundarios para lecturas puede ayudar a distribuir la carga de trabajo y mejorar el rendimiento general, especialmente en aplicaciones con muchas operaciones de lectura.
***Configuración del Conjunto de Réplicas:*** Asegúrate de que tu conjunto de réplicas esté configurado correctamente y que los nodos secundarios estén sincronizados adecuadamente con el nodo primario.
Cambiar la preferencia de lectura es una forma efectiva de aprovechar los nodos secundarios en un conjunto de réplicas de MongoDB para operaciones de lectura, mejorando así la eficiencia y el rendimiento de tu base de datos.


### Cadena de conexión de una app

cuando se tiene una instancia individual el host normal es mongodb://localhost:27018, pero haciendo uso de replica sets la configuracion cambia a:

```shell
mongodb://usuario:contraseña@host1:27017,host2:27018,host3:27019/miBaseDeDatos?replicaSet=miReplicaSet&readPreference=secondaryPreferred
```

### Ejercicios:


- configurar el cluster de mongodb

- Insertar datos a una coleccion de la base de datos mydatabase desde el nodo primario

- Seleccionar datos de la coleccion desde un nodo secundario (se espera que falle)

- Corregir el error de lectura en nodo secundario, habilitar lectura en nodos secundarios

- Seleccionar datos de la coleccion desde un nodo secundario (esta vez con resultado correcto)

- visualizar el estado del cluster

- detener el nodo maestro

- identificar que nodo secundario asumio como nuevo nodo maestro

- levantar el nodo maestro anterior




Comandos de utilidad mongodb
```javascript
### seleccionar una base de datos
use mydatabase
### listar bases de datos
show dbs o show databases
### listar colecciones
show collections
### seleccionar items de una coleccion
db.micoleccion.find()
### contar items de una coleccion
db.micoleccion.count()
### ejemplo de insercion de datos

db.miColeccion.insertMany([
    { nombre: "Ana", edad: 28, ciudad: "Madrid" },
    { nombre: "Luis", edad: 34, peliculaFavorita: "El eterno resplandor de una mente sin recuerdos" },
    { nombre: "Carlos", edad: 23, colorPreferido: "Verde fuxia" },
    { nombre: "Carlos", edad: 27, colorPreferido: "Verde fuxia" }
]);


```

comandos de utilidad docker y docker-compose

```bash
### levantar servicios de docker compose
docker-compose up -d
### detener y eliminar todos los servicios asociados docker compose
docker-compose down -v
### levantar un servicio especifico de docker compose
docker-compose up <nombre servicio> -d
### detener un servicio especifico de docker compose
docker-compose stop <nombre servicio> -d
### ejecutar mongo shell desde docker
docker exec -it <contenedor> mongosh
### listar contenedores activos
docker ps
docker-compose ps

```