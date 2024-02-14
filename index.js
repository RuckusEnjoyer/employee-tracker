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

  //This grabs first names and finds the ID of the employee/manager!
  function convertNameToId(name, data) {
    return new Promise((resolve, reject) => {
      const item = data.find((item) => item.title === name || `${item.first_name} ${item.last_name}` === name);
      if (item) {
        resolve(item.id);
      } else {
        reject(new Error(`No matching ID found for ${name}`));
      }
    });
  }

  //THE INITIAL MENU FUNCTION!!!!
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

//STARTS THE FILE!
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
    const departmentsPromise = new Promise((resolve, reject) => {
      db.query('SELECT * FROM department', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  
    departmentsPromise.then((departments) => {
      inquirer
        .prompt([
          {
            type: 'input',
            message: 'What should the new role name be?',
            name: 'roleName',
          },
          {
            type: 'input',
            message: "What is the new role's salary?",
            name: 'roleSal',
          },
          {
            type: 'list',
            message: 'What department does this role fall under?',
            choices: departments.map((department) => department.name),
            name: 'roleDep',
          },
        ])
        .then((answer) => {
          const { roleName, roleSal, roleDep } = answer;
          db.query(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [roleName, roleSal, departments.find((department) => department.name === roleDep).id],
            (error, results) => {
              if (error) {
                console.error(error);
              } else {
                console.log('Data inserted successfully');
              }
              menu();
            }
          );
        });
    });
  }


//ADDS AN EMPLOYEE
function addAnEmp() {
    //promises that grabs the roles and all the employees to be used in the prompt!
    const rolesPromise = new Promise((resolve, reject) => {
      db.query('SELECT * FROM role', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  
    const managerPromise = new Promise((resolve, reject) => {
      db.query('SELECT * FROM employee', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  
    //makes sure everything is paused until managerPromise and rolesPromise are finished!
    Promise.all([rolesPromise, managerPromise]).then(([roles, employees]) => {
  
      inquirer
        .prompt([
          {
            type: 'input',
            message: 'What is the first name of the employee?',
            name: 'empFirstName',
          },
          {
            type: 'input',
            message: 'What is the last name of the employee?',
            name: 'empLastName',
          },
          {
            type: 'list',
            message: 'What role will this employee have?',
            choices: roles.map((role) => role.title),
            name: 'empRole',
          },
          {
            type: 'list',
            message: "Who is this employee's manager?",
            choices: employees.map((employee) => `${employee.first_name} ${employee.last_name}`),
            name: 'empManager',
          },
        ])
        .then((answer) => {
            const { empFirstName, empLastName, empRole, empManager } = answer;
            //CONVERTS THE MANAGER NAME TO THEIR EMPLOYEE ID FOR USE IN DB
            convertNameToId(empManager, employees)
              .then((managerId) => {
                //CONVERTS THE ROLE NAME TO THE ROLE'S ID FOR USE IN DB
                convertNameToId(empRole, roles)
                  .then((roleId) => {

                    const query =
                      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    const values = [empFirstName, empLastName, roleId, managerId];

                    //THE DB QUERY TO ADD TO DATABASE!
                    db.query(query, values, (error, results) => {
                      if (error) {
                        console.error(error);
                      } else {
                        console.log('Data inserted successfully');
                      }
                      menu();
                    });

                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      });
  }

  //UPDATES EMPLOYEES
function updateEmp() {
  //grabs all employees from the employee database
  db.query('SELECT * FROM employee', (error, employees) => {
    if (error) {
      console.error(error);
      return;
    }

    inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would you like to update?',
        choices: employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
        name: 'empId'
      },
      {
        type: 'list',
        message: 'What would you like to update about this employee?',
        choices: ['First Name', 'Last Name', 'Role', 'Manager'],
        name: 'updater'
      },
      {
        type: 'input',
        message: 'What will the updated term be?',
        name: 'newInput'
      }
    ]).then((answers) => {
      let query;
      switch (answers.updater) {
        case 'First Name':
          query = 'UPDATE employee SET first_name = ? WHERE id = ?';
          break;
        case 'Last Name':
          query = 'UPDATE employee SET last_name = ? WHERE id = ?';
          break;
        case 'Role':
          query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          break;
        case 'Manager':
          query = 'UPDATE employee SET manager_id = ? WHERE id = ?';
          break;
        default:
          console.log('You must choose something to update!');
          return;
      }

      db.query(query, [answers.newInput, answers.empId], (error, results) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Data updated successfully');
        }
        menu();
      });
    });
  });
}