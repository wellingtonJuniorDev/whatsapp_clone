FROM nginx:stable-alpine
RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/conf.d/default.conf.template

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 8000

CMD ["/usr/local/bin/start.sh"]