
# STAGE 1: Build Stage
FROM node:20-alpine AS build 
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run build

# STAGE 2: Production Stage
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Then we'll clean up unnecessary ones
RUN npm i

# Copy built files from build stage
COPY --from=build /usr/src/app/dist ./dist 

# Copy babel config
COPY babel.config.cjs ./

RUN npm prune --production

EXPOSE 3333

# Use exec form to ensure proper signal handling
CMD ["node", "dist/server.js"]
