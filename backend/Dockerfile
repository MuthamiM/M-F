# Production backend image. Compile with the repository toolchain before building.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY node_modules ./node_modules
COPY dist ./dist
COPY src/db/init.sql ./dist/db/init.sql
RUN mkdir -p data uploads
EXPOSE 4000
CMD ["npm", "run", "start"]
