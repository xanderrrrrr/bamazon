-- Drops the database if it exists currently --
DROP DATABASE IF EXISTS bamazon;

-- creates the db -- 
CREATE DATABASE bamazon;

USE bamazon;

-- creates our products table and the settings 
CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(32,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY (item_id)
    );


-- injecting our data -- 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Clock", "Home & Kitchen", "15.00", 10), ("Trash Can", "Home & Kitchen", "50.00", 5), 
("Keyboard", "Electronics", "75.50", 20), ("Men's Watch", "Fashion", "250.00", 4), ("iPod", "Electronics", "100.00", 6),
("Burberry Scarf", "Fashion", "500.00", 8), ("24 inch Monitor", "Electronics", "200.00", 20), 
("Tissues", "Home & Kitchen", "5.00", 30), ("Headphones", "Electronics", "300.00", 50), 
("Maple syrup", "Grocery", "5.00", 50);

-- altering our table because the homework said to -- 
ALTER TABLE products 
ADD product_sales INT(32) NULL AFTER stock_quantity;

-- creating another table so that we can use the bamazonSupervisor.js file -- 
CREATE TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    overhead_costs INT(32) NOT NULL,
    PRIMARY KEY (department_id)
	);

-- injecting our dept data -- 
INSERT INTO departments (department_name, overhead_costs)
VALUES ("Electronics", "40000"), ("Home & Kitchen", "1500"), ("Fashion", "5600"), ("Grocery", "10000");

-- you may need to run this line to edit the sql mode:
SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));