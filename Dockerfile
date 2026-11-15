# Alpine build stage: small image, and Vite needs Node only while building.
# Vite 8 requires Node ^20.19 || >=22.12; node:20-alpine resolves to 20.19+.
FROM node:20-alpine AS build

WORKDIR /app

# Vite inlines VITE_* variables during "npm run build".
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# nginx runtime: tiny static server, no Node in the final image.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
