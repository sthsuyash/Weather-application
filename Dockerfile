# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.6.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
