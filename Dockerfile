FROM node:20-alpine AS base

RUN apk add --no-cache dumb-init

RUN mkdir -p /home/node/app && chown node:node /home/node/app
USER node
WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

FROM base AS build
COPY --chown=node:node . .
RUN npm run build

FROM base AS production
COPY --from=build /home/node/app/dist ./dist
COPY --from=build /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/package.json ./package.json

EXPOSE 3000
ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
