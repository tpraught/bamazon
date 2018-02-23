var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    runProducts();
});

// Function that asks the user if they would like to see a list of available products
function runProducts (res) {
    inquirer
        .prompt({
            type: "confirm",
            name: "confirm",
            message: "Welcome to BAMAZON! Would you like to view the available products?",
            default: true
        }).then(function products() {
            var query = "SELECT * FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;

                var table = new Table ({
                    head: ["ID".magenta, "Product".magenta, "Department".magenta, "Price".magenta, "Quantity Available".magenta],
                    colWidths: [5, 25, 14, 10, 16]
                });

                for (var i=0; i<res.length; i++) {
                    table.push([res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]);
                }
                
                console.log(table.toString());

                // Runs the function to ask user the product and quanityt they would like
                runOrder();
            })
        });
}

// Function to ask user the product and quantity they would like
function runOrder() {
    inquirer
        .prompt ([{
            name: "prodID",
            type: "input",
            message: "Please enter the ID of the product you want",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },{
            name: "numUnits",
            type: "input",
            message: "How many would you like?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function (answer) {
            
            // Queries database for the selected product
            var query = "SELECT stock_quantity, price, product_sales, department_name FROM products WHERE ?";
            connection.query(query, { item_id: answer.prodID }, function (err, res) {
                if (err) throw err;

                var stock = res[0].stock_quantity;
                var price = res[0].price;
                var sales = res[0].product_sales;
                var department = res[0].department_name;

                // Checks to see if there is enough inventory
                if (stock >= answer.numUnits) {
                    purchase (stock, price, sales, department, answer.prodID, answer.numUnits);
                } else {
            
                    console.log("\nThere isn't enough stock left\n".red);
            
                    runOrder();
                }
            });
        });
}

// Completes user's purchase
function purchase (stock, price, sales, department, selectedProd, selectedNumUnits) {
    
    // Update stock once purchase is complete
    var updateStock = stock - selectedNumUnits;

    // Calculates total purchase amount
    var totalPrice = price * selectedNumUnits;

    // Update total product sales
    var updateSales = parseInt(sales) + parseInt(totalPrice);

    // Update stock in database based on purchase
    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{stock_quantity: updateStock, product_sales: updateSales}, {item_id: selectedProd}],
    
    function (err,res) {
        if (err) throw err;

        // Tells user the purchase was successful
        console.log("\n---------------------------------------\n\nOrder complete");

        // Displays the total of the purchase
        console.log("\n---------------------------------------\n\nTotal: $" + totalPrice + "\n\n---------------------------------------\n");
    
        // Updates departments revenue based on the purchase
        updateDeptRevenue(updateSales, department);
    });
}

// Updates total sales for the department after a sale is completed
function updateDeptRevenue (updateSales, department) {
    var query = "SELECT total_sales FROM departments WHERE ?";
    connection.query(query, { department_name: department }, function (err, res) {
        if (err) throw err;

        var deptSales = res[0].total_sales;

        var updateDeptSales = parseInt(deptSales) + parseInt(updateSales);

        // Completes update to total sales for the department
        completeDeptSalesUpdate (updateDeptSales, department);
    });
}

// Completes update to total sales for department in database
function completeDeptSalesUpdate (updateDeptSales, department) {
    var query = "UPDATE departments SET ? WHERE ?";
    connection.query(query, [{ total_sales: updateDeptSales}, {department_name: department}], function (err,res) {
        if (err) throw err;

        runProducts();
    });
}