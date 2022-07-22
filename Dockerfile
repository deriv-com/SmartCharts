FROM nginx:alpine
COPY ./public /usr/share/nginx/html/
COPY ./default.conf /etc/nginx/conf.d/default.conf
