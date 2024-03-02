FROM node:21 as build
WORKDIR /app
COPY package*.json ./
ENV GENERATE_SOURCEMAP=false
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]