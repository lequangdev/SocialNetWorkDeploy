# Build stage
FROM node:24-alpine AS build
WORKDIR /app

# Copy package.json và package-lock.json
COPY FrontEnd/package*.json ./
RUN npm install 
# Copy toàn bộ code
COPY FrontEnd/. .
# Build Vue project
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy folder build của Vue sang nginx html
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config nginx
COPY FrontEnd/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
