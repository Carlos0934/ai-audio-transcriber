FROM node:18-alpine as build

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci


COPY . /app

RUN npm run build


FROM nginx:latest as production


COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80   

CMD ["nginx", "-g", "daemon off;"]