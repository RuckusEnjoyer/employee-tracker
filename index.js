//requiring in
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to the mysql database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'root',
      database: 'business_db'
    },
    console.log(`Connected to the business_db database.`)
  );

// TO DO: prompt that asks a bunch of questions
//----------------MODULARIZE THE ADD STATEMENTS TBH
function menu() {
    inquirer.prompt([
        {
            type:'list',
            message: 'Welcome to your Employee Database. What would you like to do?',
            choices:['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'],
            name: 'options'
        }
    ]).then((answer) => {
        
    })
}

//TO DO: 

menu()