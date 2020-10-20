const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "employees"
});
connection.connect();


// Setting up connection.query to use promises instead of callbacks
// This allows us to use the async/await syntax
// connection.query = util.promisify(connection.query);
// module.exports = connection;

    // constructor (connection){
    //     this.connection = connection;
    // }

 class Connection {   

    constructor (connection) {
        this.connection = connection
    }

    //to get all departments
    async allDept(connection){
        let [dept, dfields] = await connection.execute('SELECT * FROM department');
        console.table(dept);
        return;
    }

    //get all roles
    async  allRoles(connection){
        let [roles, rfields] = await connection.execute('SELECT * FROM role');
        console.table(roles);
        return;
    }
    
    //get all employees
    async  allEmps(connection){
        let [emp, efields] = await connection.execute('SELECT * FROM employee');
        console.table(emp);
        return;
    }
    
    //add a department
    async  addDept(connection,answers){
        let [adddept, deptField] = await connection.execute(`INSERT INTO department (name) VALUES ('${answers.dept}')`);
        console.log(`department table updated with ${answers.dept}`);
        return;
    }


    //add a role
    async  addRole(connection,answers){
        let [roleAdd,roleField] = await connection.execute(`INSERT INTO role (title, salary, dept_id) VALUES ('${answers.nameRole}','${answers.salaryRole}',(SELECT id FROM department WHERE name = '${answers.deptRole}'))`);
        console.log(`role table updated with ${answers.nameRole}`);
        return;
    }
    //add an employee
    async  addEmp(connection,answers){
        let [roleId,fields] = await connection.execute(`SELECT roleId FROM role WHERE title='${answers.empRole}'`);
        console.log(answers.empManager);
        if (answers.empManager != 'None'){
                
                let [managerId,mFields] = await connection.execute(`SELECT id FROM employee WHERE first_name='${answers.empManager.split(' ')[0]}' AND last_name='${answers.empManager.split(' ')[1]}'`);
                console.log(managerId);
                let [empAdd,empField] = await connection.execute(`INSERT INTO employee (first_name, last_name,role_id,manager_id) VALUES ('${answers.empFirstName}', '${answers.empLastName}','${JSON.parse(JSON.stringify(roleId))[0].roleId}','${JSON.parse(JSON.stringify(managerId))[0].id}')`);
        }
        else{
                let [empAdd,empField] = await connection.execute(`INSERT INTO employee (first_name, last_name,role_id) VALUES ('${answers.empFirstName}', '${answers.empLastName}','${JSON.parse(JSON.stringify(roleId))[0].roleId}')`);
        }
                    
        console.log(`employee added to employee table`);
        return;
    }
    //update an employee role
    async  updEmp(connection,answers){
        let roleID = await connection.execute(`SELECT roleId FROM role WHERE title='${answers.empUpdRole}'`);
        
        let [empUpd,empUpdField] = await connection.execute(`UPDATE employee SET role_id = '${JSON.parse(JSON.stringify(roleID[0]))[0].roleId}' WHERE first_name = '${answers.empName.split(' ')[0]}' AND last_name = '${answers.empName.split(' ')[1]}'`);
        console.log('employee role updated');
        return;
    }
    //view employees by manager
    async  empByMgr(connection){
        let [empView,fields] = await connection.execute(`SELECT * FROM employee ORDER by manager_id;`);
        console.table(empView);
        return;
    }
    //view employees by department
    async  empByDept(connection){
        let [empViewD,fields] = await connection.execute(`SELECT * FROM employee LEFT JOIN role ON role.id = employee.roleId LEFT JOIN department ON department.id = role.dept_id ORDER BY department.id;`);
        console.table(empViewD);
        return;
    }
    //view total salary per department
    async  empTotalSal(connection,answers){
        let [empViewD,fields] = await connection.execute(`SELECT SUM(salary) FROM (SELECT role.salary FROM employee LEFT JOIN role ON role.id = employee.roleId LEFT JOIN department ON department.id = role.dept_id WHERE department.name = '${answers.deptName}') AS T;`);
        console.table(empViewD);
        return;
    }
    //update employee manager 
    async  updEmpMgr(connection,answers){
        console.log(answers.empUpdMgr);
        let [empUpdMgr,fields] = await connection.execute(`UPDATE employee SET manager_id = (SELECT id FROM (SELECT * FROM employee) AS T WHERE first_name = '${answers.empUpdMgr.split(" ")[0]}' AND last_name =  '${answers.empUpdMgr.split(" ")[1]}') WHERE first_name = '${answers.empUpdName.split(' ')[0]}' AND last_name = '${answers.empUpdName.split(' ')[1]}';`);
        console.log('employee manager updated');
        return;
    }
}

module.exports.Connection = Connection;


