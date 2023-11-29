//requiring in
const inquirer = require('inquirer');
const mysql = require('mysql2');
// const Db = require('mysql2-async').default

// const { addaDep, addaRole, addAnEmp } = require('./lib/adds.js')


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
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'],
            name: 'options',
        }
    ]).then((answer) => {
        console.log(answer)
        switch(answer.options){
            case 'View All Departments':
                db.query("SELECT * FROM department", function (err, results) {
                    console.log(results);
                    menu()
                })
                break;
            case 'View All Roles':
                db.query("SELECT * FROM role", function (err, results) {
                    console.log(results);
                    menu()
                });
                break;
            case 'View All Employees':
                db.query("SELECT * FROM employee", function (err, results) {
                    console.log(results)
                    menu()
                });
                break;
            case 'Add a Department':
                addaDep()
                break;
            case 'Add a Role':
                addaRole()
                break;
            case 'Add an Employee':
                addAnEmp()
                break;
            case 'Update an Employee Role':
                updateEmp()
                break;
            default:
                menu()
                break;
        }
    })
}


menu()

//Adds a Department using inquirer and promises!!
function addaDep() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What should the new department name be?',
            name: 'depName'
        }
    ]).then((answer) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, answer.depName, (error, results) => {
            if (error) {
              console.error(error);
            } else {
              console.log('Data inserted successfully');
            }})
            menu()
  })
};

//Adds a role using inquirer and functions!!
function addaRole() {
    //storing all departments in a variable for choices later!
    let departments = db.promise().query('SELECT * FROM department');
    // departments = departments.map((department) => department.name);

    inquirer.prompt([
        {
            type: 'input',
            message: 'What should the new role name be?',
            name: 'roleName'
        },
        {
            type: 'input',
            message: "What is the new role's salary?",
            name: 'roleSal'
        },
        {
            type: 'list',
            message: "What department does this role fall under?",
            choices: departments,
            name: "roleDep"
        }
    ]).then((answer) => {
        db.query(`INSERT INTO role (name) VALUES (?)`, answer.roleName, (error, results) => {
            if (error) {
              console.error(error);
            } else {
              console.log('Data inserted successfully');
            }})
        menu()
            
        
  })
};


//function to add an employee:
function addAnEmp() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the first name of the employee?',
            name: 'empFirstName'
        },
        {
            type: 'input',
            message: 'What is the last name of the employee?',
            name: 'empLastName'
        },
        {
            type: 'list',
            message: 'What role will this employee have?',
            choices: [],
            name: "empRole"
        },
        {
            type: "list",
            message: "Who is this employee's manager?",
            choices: [],
            name: "empManager"
        }
    ]).then((answer) => {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)'
        const values = [answer.empFirstName, answer.empLastName, answer.empRole, answer.empManager]
        db.query(query, values, (error, results) => {
            if (error) {
              console.error(error);
            } else {
              console.log('Data inserted successfully');
            }})
        menu()
  })
};