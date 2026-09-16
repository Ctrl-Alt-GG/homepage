FROM nginxinc/nginx-unprivileged:1

LABEL org.opencontainers.image.description="Ctrl-Alt-GG brand homepage: program, location, FAQ, recap, and games, served as a static Hugo site by nginx."

COPY --chown=101:101 public/ /usr/share/nginx/html/

EXPOSE 8080
