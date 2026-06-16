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

RUN npm run build -w @infinity/common

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start", "-w", "backend"]
