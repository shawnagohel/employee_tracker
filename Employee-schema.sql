CREATE DATABASE IF NOT EXISTS cms;
USE cms;

CREATE TABLE IF NOT EXISTS department (depart_id int NOT NULL AUTO_INCREMENT, dept_name VARCHAR(30), PRIMARY KEY (depart_id));
CREATE TABLE IF NOT EXISTS role(roleId int NOT NULL  AUTO_INCREMENT, title VARCHAR(30), salary int, dept_id int, PRIMARY KEY (roleId), FOREIGN KEY (dept_id) REFERENCES department(depart_id));
CREATE TABLE IF NOT EXISTS employee (id int NOT NULL AUTO_INCREMENT, first_name VARCHAR(30), last_name VARCHAR(30), role_id int, manager_id int, PRIMARY KEY (id), FOREIGN KEY (role_id) REFERENCES role (roleId),FOREIGN KEY (manager_id) REFERENCES employee(id));
