FROM node:alpine as builder
WORKDIR /app
COPY . .

ARG VITE_API
ARG VITE_CHATHUB

RUN sed -i "s|^VITE_API=.*|VITE_API=${VITE_API}|" .env
RUN sed -i "s|^VITE_CHATHUB=.*|VITE_CHATHUB=${VITE_CHATHUB}|" .env

RUN yarn install
RUN yarn build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
