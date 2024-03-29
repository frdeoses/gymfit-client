# Etapa de dependencias de desarrollo
FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Etapa de construcción
FROM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# No se ejecuta npm test para agilizar la construcción, pero puedes descomentar la siguiente línea si deseas ejecutar las pruebas
# RUN npm run test
RUN npm run build

# Etapa de dependencias de producción
FROM node:19-alpine3.15 as prod-deps
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production

# Etapa final para la imagen de producción
FROM node:19-alpine3.15 as prod
EXPOSE 3000
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
# Ajusta el nombre del directorio según corresponda
COPY --from=builder /app/dist/gymfit-client ./dist  

# Asegúrate de que este comando sea adecuado para servir tu aplicación Angular
CMD ["node", "dist/main.js"]  
