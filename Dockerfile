FROM nginx:alpine
COPY ./dist /usr/share/nginx/html/dist
COPY ./index.html /usr/share/nginx/html/
COPY ./default.conf /etc/nginx/conf.d/default.conf
