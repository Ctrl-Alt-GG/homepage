FROM nginxinc/nginx-unprivileged:1

COPY --chown=101:101 public/ /usr/share/nginx/html/

EXPOSE 8080
