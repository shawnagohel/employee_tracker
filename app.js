var inquirer = require("inquirer");
var connection = require('./connection');

//get user input
const promptUser = (connection) => {

    return inquirer.prompt([
        //all options- select one
        {
            type: 'list',
            name: 'viewOption',
            message: 'Please pick one of the following',
            choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by manager','View employees by department','View total salary for a department','Add a department', 'Add a role', 'Add an employee', 'Update employee role','Update employee manager','Am Done!']
        },
        //Get name of dept - called when add a dept option is given
        {
            name: 'dept',
            message: 'Please give the name of the department(required)',
            validate: function validDpt(text){
                if(text==="" || text===" "){
                    return "Please enter a  valid department name";
                }
                return true;
            },
            when: (answers) => answers.viewOption === 'Add a department'
        },
        //Get the name of the role - called when add a role option is selected
        {
            name: 'nameRole',
            message: 'add the name of the role',
            validate: function validRole(text){
                if(text==="" || text===" "){
                    return "Please enter a  valid role";
                }
                return true;
            },
            when: (answers) => answers.viewOption === 'Add a role'
        },
        //Get the salary for the role being added - called when add a role option is selected
        
        {
            type: 'number',
            name: 'salaryRole',
            message: 'What\'s the salary for the role',
            when: (answers) => answers.viewOption === 'Add a role'
        },
        //Get name of dept of role being added - called when add a role option is selected
        
        {
            type: 'list',
            name:'deptRole',
            message: 'Please give the name of the dept for the role',
            when: (answers) => answers.viewOption === 'Add a role',
            choices: async function(){
                  let [dept,fields] = await connection.execute(`SELECT dept_name FROM department`);
                  let arr = JSON.parse(JSON.stringify(dept));
                  let dept_arr = [];
                  for(let i=0;i<arr.length;i++){
                      dept_arr.push(arr[i].dept_name);
                  }
                  return dept_arr;
            }
        },
        //Get first name of the employee being added
        {
            name: 'empFirstName',
            message: 'What\'s the employee\'s first name',
            validate: function validFirstName(text){
                if(text==="" || text===" "){
                    return "Please enter a  valid first name";
                }
                return true;
            },
            when: (answers) => answers.viewOption === 'Add an employee'
        },
        //Get last name of the employee being added
        {
            name: 'empLastName',
            message: 'Please give the last name of the employee',
            validate: function validLastName(text){
                if(text==="" || text===" "){
                    return "Please enter a  valid last name";
                }
                return true;
            },
            when: (answers) => answers.viewOption === 'Add an employee'
        },
        //Get role of employee being addded
        {
            type: 'list',
            name: 'empRole',
            message: 'What\'s the employee\'s role',
            when: (answers) => answers.viewOption === 'Add an employee' ,
            choices: async function(){
                let [role,fields] = await connection.execute(`SELECT title FROM role`);
                let arr = JSON.parse(JSON.stringify(role));
                let role_arr = [];
                for(let i=0;i<arr.length;i++){
                    role_arr.push(arr[i].title);
                }
                return role_arr;
          }
        },
        // Get manager name of employee being added
        {
            type: 'list',
            name: 'empManager',
            message: 'What\'s the employee\'s manager name',
            when: (answers) => answers.viewOption === 'Add an employee',
            choices: async function(answers){
                 
                 let [empId, fields] = await connection.execute(`SELECT first_name, last_name FROM employee LEFT JOIN role ON employee.role_id = roleId LEFT JOIN department on role.dept_id = department.depart_id WHERE dept_name = (SELECT dept_name FROM department LEFT JOIN role ON role.dept_id=department.depart_id WHERE role.title='${answers.empRole}');`);
                 console.log(empId);
                 let mgr_arr = [];
                 if(empId.length===0){
                     mgr_arr.push('None');
                 }
                 else{
                    let arr = JSON.parse(JSON.stringify(empId));
                    
                    for(let i=0;i<arr.length;i++){
                       let name = arr[i].first_name + ' ' + arr[i].last_name;
                       mgr_arr.push(name);
                    }
                 }
                 
                 return mgr_arr;
            }
        },
        //Get name of employee who's role is being updated
        {
            type: 'list',
            name: 'empName',
            message: 'Which employee do you want to update',
            when: (answers) => answers.viewOption === 'Update employee role',
            choices: async function(answers){
                  let [empName,fields] =  await connection.execute('SELECT first_name, last_name FROM employee');
                  let emp_arr = [];
                  let arr = JSON.parse(JSON.stringify(empName));
                  for (let i=0;i<arr.length;i++){
                     let name = arr[i].first_name + ' ' + arr[i].last_name;
                     emp_arr.push(name);
                  }
                  return emp_arr;
            }     
        },
        //Get new role of employee being updated
        {
            type: 'list',
            name: 'empUpdRole',
            message: 'Which is the new role of the employee',
            when: (answers) => answers.viewOption === 'Update employee role',
            choices: async function(answers){
                let [empRole,fields] =  await connection.execute('SELECT title FROM role');
                let role_arr = [];
                let arr = JSON.parse(JSON.stringify(empRole));
                for (let i=0;i<arr.length;i++){
                   
                   role_arr.push(arr[i].title);
                }
                return role_arr;
            }
          },
          //Get name of department for seeing utilized budget
          {
            type: 'list',
            name: 'deptName',
            message: 'Please select the department you want to see the utilised budget for',
            when: (answers) => answers.viewOption === 'View total salary for a department',
            choices: async function(){
                let [dept,fields] = await connection.execute(`SELECT dept_name FROM department`);
                let arr = JSON.parse(JSON.stringify(dept));
                let dept_arr = [];
                for(let i=0;i<arr.length;i++){
                    dept_arr.push(arr[i].dept_name);
                }
                return dept_arr;
            }
          },
          //Get employee name for updating his/her manager
          {
            type: 'list',
            name: 'empUpdName',
            message: 'Which employee do you want to update',
            when: (answers) => answers.viewOption === 'Update employee manager',
            choices: async function(answers){
                  let [empName,fields] =  await connection.execute('SELECT first_name, last_name FROM employee');
                  let emp_arr = [];
                  let arr = JSON.parse(JSON.stringify(empName));
                  for (let i=0;i<arr.length;i++){
                     let name = arr[i].first_name + ' ' + arr[i].last_name;
                     emp_arr.push(name);
                  }
                  return emp_arr;
            }     
          }, 
          //Get new manager of employee
          {
            type: 'list',
            name: 'empUpdMgr',
            message: 'Who is the new manager of the employee',
            when: (answers) => answers.viewOption === 'Update employee manager',
            choices: async function(answers){
                let [empName,fields] =  await connection.execute(`SELECT first_name, last_name FROM employee`);
                let emp_arr = [];
                let arr = JSON.parse(JSON.stringify(empName));
                    
                for(let i=0;i<arr.length;i++){
                       let name = arr[i].first_name + ' ' + arr[i].last_name;
                       emp_arr.push(name);
                }
                return emp_arr;
            }
          }

    ]).then(answers => {
        
         async function displayFunc(){
            switch(answers.viewOption){
                
                case 'View all departments':
                   //use connection class 
                   const c1 = new Conn(connection);
                   c1.allDept(connection).then(ans =>{
                     promptUser(connection);
                   });    
                   break;   
                case 'View all roles':
                    const c2 = new Conn(connection);
                    c2.allRoles(connection).then(ans =>{
                      promptUser(connection);
                    });    
                   break;
                case 'View all employees':
                    const c3 = new Conn(connection);
                    c3.allEmps(connection).then(ans =>{
                      promptUser(connection);
                    });     
                    break;
                case 'View employees by manager':
                    const c8 = new Conn(connection);
                    c8.empByMgr(connection).then(ans =>{
                        promptUser(connection);
                    })
                    break;
                case 'View employees by department':
                    const c9 = new Conn(connection);
                    c9.empByDept(connection).then(ans =>{
                            promptUser(connection);
                    })
                    break;
                case 'View total salary for a department':
                    const c10 = new Conn(connection);
                    c10.empTotalSal(connection,answers).then(ans =>{
                            promptUser(connection);
                    })
                    break;
                case 'Add a department':
                    const c4 = new Conn(connection);
                    c4.addDept(connection,answers).then(ans => {
                        promptUser(connection);
                    })
                    
                    break;
                case 'Add a role':
                    const c5 = new Conn(connection);
                    c5.addRole(connection,answers).then(ans => {
                        promptUser(connection);
                    })
                    break;
                case 'Add an employee':
                    const c6 = new Conn(connection);
                    c6.addEmp(connection,answers).then(ans => {
                        promptUser(connection);
                    }) 
                   
                    break;
                case 'Update employee role':
                    const c7 = new Conn(connection);
                    c7.updEmp(connection,answers).then(ans => {
                        promptUser(connection);
                    }) 
                
                    break;
                case 'Update employee manager':
                    const c11 = new Conn(connection);
                    c11.updEmpMgr(connection,answers).then(ans => {
                        promptUser(connection);
                    }) 
                
                    break;
                case 'Am Done!':
                    connection.end();
                    break;

            }
            return;
         }
         //call the function to display values 
         const display = displayFunc();
         display.then(ans => {
             
              return;
         });
        return;
    })

}

async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection to the database
    try{
        const connection = await mysql.createConnection({host:'localhost', user: 'aadi88', database: 'company'});
        promptUser(connection);
    }
    catch(err){
        throw err;
    } 

    return;
}

main();








// const viewOptions = [
//     "View Departments",
//     "View Roles",
//     "View Employees",
//     "Update Employee",
//     "exit"
// ];

// const employeeOptions = [
//     "John Stamos",
//     "Mary Walters",
//     "George Washington",
//     "Meghan Kelly",
//     "Tom Hanks",
//     "Dolly Parton",
//     "Oprah Winfrey",
//     "exit"
// ];

// const updateOptions = [
//     "First Name",
//     "Last Name",
//     "Role",
//     "exit"
// ];

// runSearch();

// //get user inputs

// function runSearch() {
//     inquirer
//         .prompt({
//             name: "action",
//             type: "list",
//             message: "What would you like to do?",
//             choices: viewOptions
//         })
//         .then(function (answer) {
//             switch (answer.action) {
//                 case viewOptions[0]:
//                     departmentView();
//                     break;

//                 case viewOptions[1]:
//                     roleView();
//                     break;

//                 case viewOptions[2]:
//                     employeeView();
//                     break;

//                 case viewOptions[3]:
//                     updateEmployee();

//                 case updateOptions[4]:
//                     connection.end();
//                     break
//             }
//         })
// }



// function departmentView() {
//     var sqlStr = "SELECT * FROM department";
//     connection.query(sqlStr, function (err, result) {
//         if (err) throw err;

//         console.table(result)
//         runSearch();
//     })
// }


// function employeeView() {
//     var sqlStr = "SELECT first_name, last_name, title, salary FROM employee ";
//     sqlStr += "LEFT JOIN role ";
//     sqlStr += "ON employee.role_id = role.id"
//     connection.query(sqlStr, function (err, result) {
//         if (err) throw err;

//         console.table(result)
//         runSearch();
//     })
// }


// function roleView() {
//     var sqlStr = "SELECT * FROM role";
//     connection.query(sqlStr, function (err, result) {
//         if (err) throw err;

//         console.table(result)
//         runSearch();
//     })
// }


// const updateEmployee = () => {

//     function runUpdateSearch() {
//         inquirer
//             .prompt({
//                 name: "action",
//                 type: "list",
//                 message: "Which employee do you want to update?",
//                 choices: employeeOptions
//             })
           
//         }
//         runUpdateSearch();  
//     }