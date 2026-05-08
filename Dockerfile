FROM node:22-alpine as react_build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.22.1
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=react_build /app/dist /usr/share/nginx/html

