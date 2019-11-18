FROM node:latest
COPY . /dfs-app
ENV APP_PORT="4000" DB_PROD_PATH="mongodb://developer:password1@ds345028.mlab.com:45028/dfs"
RUN cd /dfs-app && yarn install
ENTRYPOINT cd /dfs-app && yarn start
EXPOSE 4000