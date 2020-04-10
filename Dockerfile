FROM nginx:alpine
COPY ./dist /usr/share/nginx/html/beta/dist
COPY ./index.html /usr/share/nginx/html/beta/
COPY ./default.conf /etc/nginx/conf.d/default.conf
