//requiring in
const inquirer = require('inquirer');
const mysql = require('mysql2');

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
            choices:['View All Departments', 
            'View All Roles', 
            'View All Employees', 
            'Add a Department', 
            'Add a Role', 
            'Add an Employee', 
            'Update an Employee Role'],
            name: 'options'
        }
    ]).then((answer) => {
        switch(answer.options){
            case 'View All Departments':
                db.query("SELECT * FROM departments", function (err, results) {
                    console.log(results);
                })
                break;
            case 'View All Roles':
                db.query("SELECT * FROM roles", function (err, results) {
                    console.log(results);
                });
                break;
            case 'View All Employees':
                db.query("SELECT * FROM employees", function (err, results) {
                    console.log(results);
                });
                break;
            case 'Add a Department':
                addaDep();
                break;
            case 'Add a Role':
                addaRole();
                break;
            case 'Add an Employee':
                addAnEmp();
                break;
            case 'Update an Employee Role':
                updateEmp();
                break;
        }
    })
}

//TO DO: 

menu()