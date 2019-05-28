# Use latest node image
FROM node:7.10.0

ARG ORAKWLUM_FRONTEND_VERSION=master

RUN mkdir -p /opt
COPY . /opt/orakWlum-frontend
WORKDIR /opt/orakWlum-frontend

# Install node dependencies
RUN cd /opt/orakWlum-frontend && yarn install

# Build page
RUN chmod +x /opt/orakWlum-frontend/utils/build.sh
RUN cd /opt/orakWlum-frontend && utils/build.sh

# Copy page to nginx output
RUN rm -rf /var/www
RUN cp -r /opt/orakWlum-frontend/www /var/www

# tMP workaround until frontend fixing
RUN ln -s /opt/orakWlum-frontend /opt/oraKWlum-frontend

# Give read permissions to everyone for var/www
RUN chmod -R +r /var/www

# Install nginx
RUN echo "deb [check-valid-until=no] http://cdn-fastly.deb.debian.org/debian jessie main" > /etc/apt/sources.list.d/jessie.list
RUN echo "deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
RUN sed -i '/deb http:\/\/deb.debian.org\/debian jessie-updates main/d' /etc/apt/sources.list
RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get -y install nginx

# Expose HTTP listeners
EXPOSE 80
EXPOSE 443

# Replace nginx config file 
RUN rm /etc/nginx/nginx.conf
RUN cp /opt/orakWlum-frontend/conf/nginx.conf /etc/nginx/nginx.conf
#ADD certs /opt/certs

# Set okW vhost config file
RUN cp /opt/orakWlum-frontend/conf/production_nossl.conf /etc/nginx/sites-enabled/default

# Create default logs directories
RUN mkdir -p /var/log/orakwlum/

# Add runnable script to start nginx patching host name
RUN cp utils/run_frontend.sh /run_frontend.sh
RUN chmod 700 /run_frontend.sh
