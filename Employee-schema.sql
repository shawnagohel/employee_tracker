DROP DATABASE IF EXISTS CMS; 
CREATE DATABASE CMS;

USE CMS;

CREATE TABLE department 
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL 
    
);

CREATE TABLE role
    
    (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30), 
        salary DECIMAL NOT NULL, 
        dept_id INT, 
        FOREIGN KEY (dept_id) REFERENCES department(id) ON DELETE CASCADE
     
    );
    
    
CREATE TABLE employee
        
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(30),
            last_name VARCHAR(30), 
            manager_id INT,
            roleId INT,
            FOREIGN KEY (roleId) REFERENCES role(id) ON DELETE CASCADE,
            FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL

        );
        