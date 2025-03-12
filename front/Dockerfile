# front/Dockerfile

# 1) Build stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2) Production stage (using nginx to serve the built files)
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
