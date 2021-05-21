# Prismic Tool
Back-end tool to handle bulk documents from Prismic CMS

- api (back-end) => node.js
- my-app (front-end) => react
- add/modify in my-app/package.json -> "proxy": "http://localhost:3080",
- run with docker-compose / manual start

# Steps - with docker-compose
1. Clone the project to local machine
2. CD project root
3. add/modify in my-app/package.json -> "proxy": "http://node-api:3080",
4. docker-compose up
5. Open project in browser http://localhost:3000/


# Steps - without docker-compose
1. Clone the project to local machine

---- Setup & Start Back End ----

2. CD project root/api
3. npm install
4. node ./server.js or development nodemon ./server.js

---- Setup & Start Frontend ----

5. CD project root/my-app
6. yarn install
7. add/modify in my-app/package.json -> "proxy": "http://localhost:3080",
8. yarn start

9. Open project in browser http://localhost:3000/

# Edit locals list
 - my-app/src/config/locales.js
