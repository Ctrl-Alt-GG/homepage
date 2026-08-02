FROM nginxinc/nginx-unprivileged:1.30.4-alpine

COPY --chown=101:101 public/ /usr/share/nginx/html/

EXPOSE 8080
