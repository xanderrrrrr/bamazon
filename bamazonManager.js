// setting my required dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// setting up the sql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

// connecting to the database and running the function that will prompt the users
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // run the prompt function
    initialPrompt();
});


// function that prompts users if they want to buy or exit
function initialPrompt() {
    inquirer
    .prompt(
        {
            name: "action",
            type: "list",
            message: "what would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    )
    .then(function(actionAnswer) {
        switch (actionAnswer.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                //function
                break;

            case "Add New Product":
                //function
                break;
      
            case "Exit":
                connection.end();
                break;
        }
    });
}

function viewProducts() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products;";
    connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
        }
    console.log("\n")
    initialPrompt();
    });
}

function viewLowInventory() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5;"
    connection.query(query, function(err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
        } 
        console.log("\n");
    initialPrompt();
    })
}