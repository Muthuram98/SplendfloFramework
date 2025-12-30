FROM mcr.microsoft.com/playwright:v1.46.0-jammy

COPY package.json .
RUN apt-get update -y && \
    apt-get install -y python3-pip && \
    pip3 install awscli &&\
    npm install --force