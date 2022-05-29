# Board Game Database

Northcoders Bootcamp Back End Project

# Project Summary

All necessary information and required files to create a database/node-based API are contained within this repo. This particular repo is for board games reviews and includes:

- Seed files to create a Postgres database
- Development and test data (JavaScript)
- Testing suites for all API endpoints and utility functions used (in Jest and SuperTest)
- The API made in the MVC format using express.js

## Versions needed to run this project locally

Node version: v17.8.0 or higher
PostgreSQL 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1) or higher

Version used on other Operating Systems may be different.

## Instructions for how to do this yourself

## Running locally

First, clone the github repo in your terminal:

git clone https://github.com/mgrindrod92/Backend-Project-NC-Games-

## Install required dependencies

Use npm i **_____** (using the below to fill the **_____** space)

dotenv
express
fs
fs.promises
husky
jest
jest-extended
jest-sorted
nodemon
pg
pg-format
supertest

## Create local .env files

To be able to connect to two databases locally, you must add environment variables (.env files) for each of your datasets. These must be added within the db folder and a separate command must be added to the gitignore folder, so that sensitive information is not pushed to github

After installing npm i dotenv, require .env within node:

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
path: `${__dirname}/../.env.${ENV}`,
});

Add an error condition to check this has been configured correctly:

if (!process.env.PGDATABASE) {
throw new Error('PGDATABASE not set');
}

To create environment variables, go into the 'db' folder with the repo and use the 'touch' command to create .env.test and .env.development. 

Within each file, add the line 'PGDATABASE=<database_name_here>' with the correct database name included. 

Ensure that these files are added to your own gitignore file if you do not wish for your repo to be cloned (.env.\*).

## Seed your local database

Run the command npm run setup-dbs in the terminal

## Run tests by

Run the command npm run test in the terminal

## Link to online version

This API is currently hosted on Heroku and can be found at https://nc-be-games-project.herokuapp.com/api/. This endpoint is a directory for all currently available endpoints.
