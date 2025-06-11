Github url: https://github.com/Wesley436/GBC_MADS_4012_Project
Railway page url: https://gbcmads4012project-production.up.railway.app/

Overview
This project allows the user to manage the personnels, ships and missions for the United Earth Space Exploration Command by creating records for each personnels, ship and missions, as well as assigning multiple personnels and/or a misison to each ship.

Instructions on how to setup and deploy the application
NPM packages installed: dotenv, ejs, express, express-session, mongoose, nodemon (dev only)
The database connection string is stored in the DATABASE_CONNECTION_STRING variable .env file
For local webpage, run 'npm run start' or 'npm run dev' at the root directory.
To deploy, simply upload the entire project (except the .env file) to Github, then login to Railway to connect the repository, and add the DATABASE_CONNECTION_STRING to the Railway project's variable list.

File Structures
