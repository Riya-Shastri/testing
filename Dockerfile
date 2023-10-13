FROM node:16.10-alpine as node
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 5600
RUN npm run build-prod

FROM nginx:alpine
COPY --from=node app/dist/HostingWeb app/usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]