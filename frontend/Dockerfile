FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY libs/common/package.json ./libs/common/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN npm ci

COPY tsconfig.base.json ./
COPY libs ./libs
COPY frontend ./frontend

RUN npm run build -w @infinity/common

ARG VITE_API_BASE_URL=http://localhost:3000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build -w frontend

FROM nginx:1.27-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
