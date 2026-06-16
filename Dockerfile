FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY libs/common/package.json ./libs/common/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN npm ci

COPY tsconfig.base.json ./
COPY libs ./libs
COPY backend ./backend
COPY frontend ./frontend

RUN npm run build -w @infinity/common

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build -w frontend

ENV NODE_ENV=production
ENV STATIC_DIR=/app/frontend/dist
ENV TRUST_PROXY=1
EXPOSE 3000

CMD ["npm", "run", "start", "-w", "backend"]
