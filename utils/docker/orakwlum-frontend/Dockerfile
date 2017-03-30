# Utilitzar com a base: node
FROM node:latest
# Clone repository
# * Node image already have git so no apt-get install git needed
RUN mkdir -p /opt
RUN cd /opt && git clone https://github.com/gisce/oraKWlum-frontend.git 
# Install node dependencies
RUN cd /opt/oraKWlum-frontend && npm install
# Build page
RUN chmod +x /opt/oraKWlum-frontend/utils/build.sh
RUN cd /opt/oraKWlum-frontend && utils/build.sh
# Copy page to nginx output
RUN rm -rf /var/www
RUN cp -r /opt/oraKWlum-frontend/www /var/www
# Give read permissions to everyone for var/www
RUN chmod -R +r /var/www
# Install nginx
RUN apt-get update
RUN apt-get -y install nginx
# Set nginx config file
RUN cp /opt/oraKWlum-frontend/conf/production.conf /etc/nginx/sites-enabled/default
# Expose HTTP Contents
EXPOSE 80
EXPOSE 443
# Replace nginx config file 
RUN rm /etc/nginx/nginx.conf
ADD nginx.conf /etc/nginx/nginx.conf
# Create default logs directories
RUN mkdir -p /var/log/orakwlum/
# Add runnable script to start nginx patching host name
ADD run_frontend.sh run_frontend.sh
RUN chmod 700 run_frontend.sh
CMD CMD /bin/bash run_frontend.sh
