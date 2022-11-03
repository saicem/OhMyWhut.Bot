FROM node:18-alpine3.15

WORKDIR /app

COPY package.json pnpm-*.yaml ./

ARG REGISTRY

RUN if [[ -n "${REGISTRY}" ]]; then npm config set registry ${REGISTRY}; fi && \
    npm install -g pnpm && \
    if [[ -n "${REGISTRY}" ]]; then pnpm config set registry ${REGISTRY}; fi && \
    pnpm install

COPY . .

RUN pnpm exec tsc && pnpm exec prisma generate && pnpm exec prisma db push

EXPOSE 3000

CMD ["node", "/app/dist/main.js"]
