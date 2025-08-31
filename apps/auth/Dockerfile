  FROM node:18-alpine AS base

  WORKDIR /usr/src/app
  
  COPY package.json pnpm-lock.yaml ./

  RUN npm install -g pnpm && pnpm install

  COPY . .

  FROM base AS development
  RUN pnpm run build auth

  FROM node:18-alpine AS production
  WORKDIR /usr/src/app

  COPY package.json pnpm-lock.yaml ./

  RUN npm install -g pnpm && pnpm install --prod

  COPY --from=development /usr/src/app/dist ./dist
  
  CMD ["node", "dist/apps/auth/main"]
  