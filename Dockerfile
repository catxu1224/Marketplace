FROM nginx:stable-alpine
COPY *.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV PORT=8080
EXPOSE 8080
