# Northcoders News API

HOSTED VERSION:
The API is hosted on Render and can be accessed at: https://sabrinas-nc-news.onrender.com 
The /api endpoint provides a complete list of available routes and their functionality.

PROJECT SUMMARY:

This API serves as the backend for a news application, providing endpoints for managing and retrieving data. It allows users to fetch and interact with articles, topics, users, and comments. Users can create new comments, update existing ones, or delete them as needed. The API supports filtering and sorting functionality, enabling users to sort articles by criteria such as date, topic, or author.

The API also includes robust error handling, responding with appropriate error messages for invalid requests, such as malformed queries or requests for non-existent resources.

SET-UP:

In order to run this project, you will need Node.js (v16.0.0 or higher) and PostgreSQL (v14.0.0 or higher)

To access this repositary locally, you will need to clone it. To do this, open your terminal and type in the command 'git clone' then the link to the repositary: https://github.com/Sabrinafraschetti/my-nc-news.git.

Then, you will need to install the dependancies listed in the package.json file onto your cloned repositary by typing the command 'npm install' into your terminal.

In order to sucessfully connect to the two databases used in this project and be able to run it locally, you will need to create two .env files: .env.test and .env.development. 

You will then need to add PGDATABASE= nc_news into the .env.development file and PGDATABASE= nc_news_test into the .env.test file. These files will e gitignored automatically.

Now that you have set up the environment variables and installed all the dependancies, you will be able to seed the local database by running the command 'npm run setup-dbs' in your terminal, followed by 'npm run seed'. The first command will set up the database and the latter will seed it.

At this point, you will be able to execute the test suite to verify functionality, using the command npm test. The tests cover, endpoint functionality, data validation and error handling.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
