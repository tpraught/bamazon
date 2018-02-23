DROP DATABASE bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INTEGER auto_increment NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR (50) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INTEGER (10) NOT NULL,
    primary key (item_id)
);

CREATE TABLE departments (
    department_id INTEGER auto_increment NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL (7,2) NOT NULL DEFAULT '0.00',
    total_sales DECIMAL (7,2) NOT NULL DEFAULT '0.00',
    primary key (department_id)
);

ALTER TABLE products ADD product_sales DECIMAL(7,2) DEFAULT '0.00';

SELECT * FROM products;

SELECT * FROM departments;
