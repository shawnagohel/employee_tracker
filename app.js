const inquirer = require("inquirer");
const { Connection: Conn } = require("./connection");
const util = require("util");

//user input
const promptUser = (connection) => {
  return inquirer
    .prompt([
      //List of options - user select's one
      {
        type: "list",
        name: "viewOption",
        message: "Please pick one of the following",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "View employees by manager",
          "View employees by department",
          "View total salary for a department",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Update employee manager",
          "Am Done!",
        ],
      },

      /**
       * Adding a department
       */

      //Add department name
      {
        name: "dept",
        message: "Please give the name of the department(required)",
        validate: function validDpt(text) {
          if (text === "" || text === " ") {
            return "Please enter a  valid department name";
          }
          return true;
        },
        when: (answers) => answers.viewOption === "Add a department",
      },

      /**
       * Adding a role
       *  */

      //Obtain the name of the role
      {
        name: "nameRole",
        message: "add the name of the role",
        validate: function validRole(text) {
          if (text === "" || text === " ") {
            return "Please enter a  valid role";
          }
          return true;
        },
        when: (answers) => answers.viewOption === "Add a role",
      },

      //Add the salary information
      {
        type: "number",
        name: "salaryRole",
        message: "What's the salary for the role",
        when: (answers) => answers.viewOption === "Add a role",
      },

      // Obtain the name of the department
      {
        type: "list",
        name: "deptRole",
        message: "Please give the name of the dept for the role",
        when: (answers) => answers.viewOption === "Add a role",
        choices: async function () {
          let [dept, fields] = await connection.execute(
            `SELECT name FROM department`
          );
          let arr = JSON.parse(JSON.stringify(dept));
          let dept_arr = [];
          for (let i = 0; i < arr.length; i++) {
            dept_arr.push(arr[i].name);
          }
          return dept_arr;
        },
      },

      /**
       * Adding an Employee
       */

      //Obtain the first name of the employee being added
      {
        name: "empFirstName",
        message: "Please input the first name of the employee",
        validate: function validFirstName(text) {
          if (text === "" || text === " ") {
            return "Please enter a  valid first name";
          }
          return true;
        },
        when: (answers) => answers.viewOption === "Add an employee",
      },
      //Obtain the last name of the employee being added
      {
        name: "empLastName",
        message: "Please input the last name of the employee",
        validate: function validLastName(text) {
          if (text === "" || text === " ") {
            return "Please enter a  valid last name";
          }
          return true;
        },
        when: (answers) => answers.viewOption === "Add an employee",
      },


      //Obtain the title of the employee
      
      
      {
        type: "list",
        name: "empRole",
        message: "What's the employee's title",
        when: (answers) => answers.viewOption === "Add an employee",
        choices: async function () {
          let [role, fields] = await connection.execute(
            `SELECT title FROM role`
          );
          let arr = JSON.parse(JSON.stringify(role));
          let role_arr = [];
          for (let i = 0; i < arr.length; i++) {
            role_arr.push(arr[i].title);
          }
          return role_arr;
        },
      },
      
      
      // Assign a manager to the created employee
      
      
      {
        type: "list",
        name: "empManager",
        message: "Please input the manager name",
        when: (answers) => answers.viewOption === "Add an employee",
        choices: async function (answers) {
          let [empId, fields] = await connection.execute(
            `SELECT first_name, last_name FROM employee LEFT JOIN role ON employee.roleId = role.id LEFT JOIN department on role.dept_id = department.id WHERE name = (SELECT name FROM department LEFT JOIN role ON role.dept_id=department.id WHERE role.title='${answers.empRole}');`
          );
          console.log(empId);
          let mgr_arr = [];
          if (empId.length === 0) {
            mgr_arr.push("None");
          } else {
            let arr = JSON.parse(JSON.stringify(empId));

            for (let i = 0; i < arr.length; i++) {
              let name = arr[i].first_name + " " + arr[i].last_name;
              mgr_arr.push(name);
            }
          }

          return mgr_arr;
        },
      },

      /**
       * Updating an employee's manager
       */

      //select the employee to update
      {
        type: "list",
        name: "empNameToUpdMgr",
        message: "What is the name of the employee you wish to update",
        when: (answers) => answers.viewOption === "Update employee manager",
        choices: async function (answers) {
          let [empName, fields] = await connection.execute(
            "SELECT first_name, last_name FROM employee"
          );
          let emp_arr = [];
          let arr = JSON.parse(JSON.stringify(empName));
          for (let i = 0; i < arr.length; i++) {
            let name = arr[i].first_name + " " + arr[i].last_name;
            emp_arr.push(name);
          }
          return emp_arr;
        },
      },

      // Select a manager for the employee
      {
        type: "list",
        name: "empManagerChoice",
        message: "Please input the manager name",
        when: (answers) => answers.viewOption === "Update employee manager",
        choices: async function (answers) {
          let [empId, fields] = await connection.execute(
            `SELECT first_name, last_name FROM employee`
            // `SELECT first_name, last_name FROM employee LEFT JOIN role ON employee.roleId = role.id LEFT JOIN department on role.dept_id = department.id WHERE name = (SELECT name FROM department LEFT JOIN role ON role.dept_id=department.id WHERE role.title='${answers.empRole}');`
          );
          console.log(empId);
          let mgr_arr = [];
          if (empId.length === 0) {
            mgr_arr.push("None");
          } else {
            let arr = JSON.parse(JSON.stringify(empId));

            for (let i = 0; i < arr.length; i++) {
              let name = arr[i].first_name + " " + arr[i].last_name;
              mgr_arr.push(name);
            }
          }

          return mgr_arr;
        },
      },

      /***
       * Updating an employee's role
       */

      //select the employee to update
      {
        type: "list",
        name: "empNameToUpdRole",
        message: "What is the name of the employee you wish to update",
        when: (answers) => answers.viewOption === "Update employee role",
        choices: async function (answers) {
          let [empName, fields] = await connection.execute(
            "SELECT first_name, last_name FROM employee"
          );
          let emp_arr = [];
          let arr = JSON.parse(JSON.stringify(empName));
          for (let i = 0; i < arr.length; i++) {
            let name = arr[i].first_name + " " + arr[i].last_name;
            emp_arr.push(name);
          }
          return emp_arr;
        },
      },

      //Update Role
      {
        type: "list",
        name: "empUpdRoleChoice",
        message: "What is the new role of the employee",
        when: (answers) => answers.viewOption === "Update employee role",
        choices: async function (answers) {
          let [empRole, fields] = await connection.execute(
            "SELECT title FROM role"
          );
          let role_arr = [];
          let arr = JSON.parse(JSON.stringify(empRole));
          for (let i = 0; i < arr.length; i++) {
            role_arr.push(arr[i].title);
          }
          return role_arr;
        },
      },
      //Department name for budget
      {
        type: "list",
        name: "deptName",
        message:
          "Please select the department you would like to see the budget for",
        when: (answers) =>
          answers.viewOption === "View total salary for a department",
        choices: async function () {
          let [dept, fields] = await connection.execute(
            `SELECT name FROM department`
          );
          let arr = JSON.parse(JSON.stringify(dept));
          let dept_arr = [];
          for (let i = 0; i < arr.length; i++) {
            dept_arr.push(arr[i].name);
          }
          return dept_arr;
        },
      },
    ])
    
    .then((answers) => {
      async function displayFunc() {
        switch (answers.viewOption) {
          case "View all departments":
            //use connection class
            const c1 = new Conn(connection);
            c1.allDept(connection).then((ans) => {
              promptUser(connection);
            });
            break;
          case "View all roles":
            const c2 = new Conn(connection);
            c2.allRoles(connection).then((ans) => {
              promptUser(connection);
            });
            break;
          case "View all employees":
            const c3 = new Conn(connection);
            c3.allEmps(connection).then((ans) => {
              promptUser(connection);
            });
            break;
          case "View employees by manager":
            const c8 = new Conn(connection);
            c8.empByMgr(connection).then((ans) => {
              promptUser(connection);
            });
            break;
          case "View employees by department":
            const c9 = new Conn(connection);
            c9.empByDept(connection).then((ans) => {
              promptUser(connection);
            });
            break;
          case "View total salary for a department":
            const c10 = new Conn(connection);
            c10.empTotalSal(connection, answers).then((ans) => {
              promptUser(connection);
            });
            break;
          case "Add a department":
            const c4 = new Conn(connection);
            c4.addDept(connection, answers).then((ans) => {
              promptUser(connection);
            });

            break;
          case "Add a role":
            const c5 = new Conn(connection);
            c5.addRole(connection, answers).then((ans) => {
              promptUser(connection);
            });
            break;
          case "Add an employee":
            const c6 = new Conn(connection);
            c6.addEmp(connection, answers).then((ans) => {
              promptUser(connection);
            });

            break;
          case "Update employee role":
            const c7 = new Conn(connection);
            c7.updEmpRole(connection, answers).then((ans) => {
              promptUser(connection);
            });

            break;
          case "Update employee manager":
            const c11 = new Conn(connection);
            c11.updEmpMgr(connection, answers).then((ans) => {
              promptUser(connection);
            });

            break;
          case "Am Done!":
            connection.end();
            process.exit()
        }
        console.log('Bye');
        return;
      }
      //call the function to display values
      displayFunc()
      .then((ans) => {
        return;
      });
    });
};

async function main() {


  // get the client
  const mysql = require("mysql2/promise");
  // create the connection to the database
  try {
    // const connection = await mysql.createConnection({host:'localhost', user: 'shawnagohel', database: 'cms'});
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Vivienne218",
      database: "cms",
    });
    promptUser(connection)
  } catch (err) {
    console.log(err);
  }
  return;
}

main();
