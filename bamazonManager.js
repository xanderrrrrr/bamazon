// setting my required dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// setting up the sql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon",
  supportBigNumbers: true,
  bigNumberStrings: true,
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
    // switch case handling the logic of which functions should be invoked
    .then(function(actionAnswer) {
        switch (actionAnswer.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addToArray();
                break;

            case "Add New Product":
                addNewProduct();
                break;
      
            case "Exit":
                connection.end();
                break;
        }
    });
}

// function that queries the db to show all the items
function viewProducts() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products;";
    connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
        }
    console.log("\n")

    // re-prompts the user for next action
    initialPrompt();
    });
}

// function that shows the user all items with less than 5 inventory
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

// function that prompts the user for what new item to add to the db
function addNewProduct() {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What is the name of the product? "
        },
        {
            name: "departmentName",
            type: "list",
            message: "What department should this go in?",
            choices: [
                "Home & Kitchen",
                "Electronics",
                "Fashion",
                "Grocery"
                ]
        },
        {
            name: "productPrice",
            type: "number",
            message: "What is the product's price? "
        },
        {
            name: "productQuantity",
            type: "number",
            message: "How many of the product do we have? "
        }]
    ).then(function(answer) {
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?);"
        connection.query(query, [answer.productName, answer.departmentName, answer.productPrice, answer.productQuantity], function(err, res) {
            if (err) throw err;
            console.log("Successfully entered the product! \n");
            initialPrompt();
        })

    })

}

// function that is called when "add to inventory" is selected so I have an array of choices for the user 
function addToArray() {
    var productArray = [];
    var query = "SELECT product_name FROM products;";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            productArray.push(res[i].product_name);
        }
        // invoking the function that will prompt the user for choices (passing through the choices)
        addToInventory(productArray)
    });
    
}

// function that prompts the user which item from choices they want to update
function addToInventory(productArray) {
    inquirer.prompt([
        {
            name: "whichItem",
            type: "rawlist",
            message: "Which item would you like to add more of? ",
            choices: productArray
        },
        {
            name: "howMany",
            type: "number",
            message: "How many of the product are we adding? "
        }
    ]).then(function(answer) {
        var query = "SELECT stock_quantity FROM products WHERE ?"
        connection.query(query, {product_name: answer.whichItem}, function(err, res) {
            if (err) throw err;
            var new_quantity = res[0].stock_quantity + answer.howMany;
            var whichItem = answer.whichItem;
            // invoking a function that will actually update the db with the user's choices (passing the choices thru)
            updateQuantity(whichItem, new_quantity);
        })
    })
}

// function that actually updates the db with the user's choices
function updateQuantity(whichItem, new_quantity) {
            var query = "UPDATE products SET stock_quantity = ? WHERE product_name = ?;"
        connection.query(query, [new_quantity, whichItem], function(err, res) {
            if (err) throw err;
            console.log("Successfully entered the product! \n We now have " + new_quantity + " " + whichItem + "(s)\n");
            initialPrompt();
        })
}