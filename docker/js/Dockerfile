FROM node:26.12.1-alpine

WORKDIR /var/www/html/js

COPY package.json pnpm-lock.yaml ./
RUN npm install --global corepack@0.34.6 && corepack enable && pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
