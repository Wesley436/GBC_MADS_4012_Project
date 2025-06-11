Github url: https://github.com/Wesley436/GBC_MADS_4012_Project
Railway page url: https://gbcmads4012project-production.up.railway.app/

Overview
This project allows the user to manage the personnels, ships and missions for the United Earth Space Exploration Command by creating records for each personnels, ship and missions, as well as assigning multiple personnels and/or a misison to each ship.

Instructions on how to setup and deploy the application
NPM packages installed: dotenv, ejs, express, express-session, mongoose, nodemon (dev only)
The database connection string is stored in the DATABASE_CONNECTION_STRING variable .env file
For local webpage, run 'npm run start' or 'npm run dev' at the root directory.
To deploy, simply upload the entire project (except the .env file) to Github, then login to Railway to connect the repository, and add the DATABASE_CONNECTION_STRING to the Railway project's variable list.

File Structure
.
├── .git
├── config/
│   └── db.js
├── controller/
│   ├── mission_controller.js
│   ├── personnel_controller.js
│   └── ship_controller.js
├── models/
│   ├── mission_model.js
│   ├── personnel_model.js
│   ├── personnel_ship_assignment_model.js
│   ├── ship_mission_assignment_model.js
│   └── ship_model.js
├── node_modules
├── public/
│   ├── css/
│   │   └── style.css
│   ├── img
│   └── js/
│       ├── create_mission.js
│       ├── create_personnel.js
│       ├── create_ship.js
│       ├── mission.js
│       ├── personnel.js
│       ├── ship.js
│       └── utilities.js
├── views/
│   ├── partials/
│   │   ├── error_messages.ejs
│   │   ├── footer.ejs
│   │   └── header.ejs
│   ├── create_mission.ejs
│   ├── create_personnel.ejs
│   ├── create_ship.ejs
│   ├── home.ejs
│   ├── mission.ejs
│   ├── personnel.ejs
│   └── ship.ejs
├── .env
├── .gitattributes
├── .gitignore
├── server.js
├── package.json
├── package-lock.json
└── README.txt