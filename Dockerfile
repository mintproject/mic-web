FROM node:16 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN yarn install
COPY ./ /app/
RUN yarn run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
