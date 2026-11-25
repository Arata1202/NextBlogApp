FROM node:26.13.1-alpine

WORKDIR /var/www/html/js

RUN npm install --global corepack@0.34.6 && corepack enable && chown node:node .
USER node
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

EXPOSE 3000

CMD ["pnpm", "dev"]
