FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite requires --host to be exposed to external when inside a container
CMD ["npm", "run", "dev", "--", "--host"]
