# Database Name

## Updated instructions

What files must a developer add in order to successfully connect to two databases locally?

To be able to connect to two databases locally, you must add  environment variables (.env files) for each of your datasets.
These must be added within the db folder and a separate command must be added to the gitignore folder, so that sensitive information is not pushed to github

## Instructions for how to do this yourself

Install the dotenv package (npm i dotenv) and require it in:

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

Add an error condition to check this has been configured correctly:

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

To create environment variables, go into the 'db' folder with the repo and use the 'touch' command to create .env.test and .env.development.
Within each file, add the line 'PGDATABASE=<database_name_here>' with the correct database name included
Emsure that these files are added to your own gitignore file if you do not wish for your repo to be cloned (.env.*).
