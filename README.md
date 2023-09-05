# API Project
## Intro
Welcome to AirBnotB! Come on by and check some fun spots for your next vacation!

## Starting up the project for the first time
For those of you who are cloning this project for the first time please be sure to run this command:
```npm install && npm run render-postbuild && npm run build && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all```
If you are not running the project locally and would prefer to view it on render, you can use this link [here](https://api-project-mdfg.onrender.com)

## Technologies Used
In this project I am making use of Sequelize and SQL in the back end to run the API routes. In the front end, I used REACT to get the data from the database. If you wish to make use of all of the app's functions be sure to either create a user or login as the demo user. Once you are logged in, you should be able to create new spots, manage your spots, post reviews, and delete reviews.  

## Database Scheme Design

![db-schema]

[db-schema]: ./images/airbnb_dbdiagram.png

## API Documentation
