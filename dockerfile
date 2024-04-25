FROM node:20-alpine 

#Create working directory
WORKDIR /todo-auth-app

#Install all dependencies
COPY package*.json ./

#Run npm install
RUN npm install

#Bundle app source
COPY . .

# Set default environment variables
ENV PORT=7272
ENV mongoUrl=mongodb://localhost:27017/mydb.todo-auth


# Expose port
EXPOSE 7173

CMD [ "node", "index.js" ]