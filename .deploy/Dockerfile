# -------------------------
# ------ Build Stage ------
# -------------------------
FROM node:18 AS build-stage

# Establece el directorio de trabajo donde se encuentran los archivos de la aplicación
WORKDIR /app

# Copia solo los package.json y package-lock.json para aprovechar el cache de Docker.
# Asume que estos archivos están en el directorio 'test-crun' localmente
# y que el contexto de build es la carpeta que contiene 'test-crun'.
COPY test-crun/package*.json ./

# Instala las dependencias. Si hay un package-lock.json, se usará.
RUN npm install

# Copia el resto de los archivos de la aplicación (el código fuente de test-crun)
COPY test-crun/. .

# Instala beyond globalmente
RUN npm i -g beyond@1.2.5

# Construye el proyecto con beyond
RUN beyond build --pkg=test-crun --distribution=node --logs

# ------------------------------
# ------ Production Stage ------
# ------------------------------
FROM node:18-slim 

# Establece el directorio de trabajo para la aplicación final
WORKDIR /app

# Copia los node_modules desde la etapa de construcción (ubicados correctamente)
COPY --from=build-stage /app/test-crun/node_modules ./node_modules

# Copia solo los archivos de la aplicación compilados desde la etapa de construcción
COPY --from=build-stage /app/test-crun/.beyond/builds/node/code/. .

# Comando para iniciar la aplicación
CMD [ "node", "index.js" ]