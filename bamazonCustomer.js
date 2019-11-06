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
                "Buy an item",
                "Exit"
            ]
        }
    )
    .then(function(actionAnswer) {
        switch (actionAnswer.action) {
            case "Buy an item":
                addProductsToArray();
              break;
      
            case "Exit":
                connection.end();
              break;
        }
    });
}

// this function will add products to an array of choices
// doing it this way becuase I need the array of choices to exist before inquirer.prompt'ing the user
function addProductsToArray() {
    productArray = [];
    var query = "SELECT product_name FROM products ;";
    connection.query(query, function(err, res) {
        if (err) throw err;
        // pushing into the array to be used in the options below
        for (var i = 0; i < res.length; i++) {
            productArray.push(res[i].product_name);
        }
        // invoking the function to prompt users 
        buyProduct(productArray);
    })
}

// function that will prompt the user and update our db if necessary
// passing through our product array for our choices of what they'd like to buy from the above function
function buyProduct(productArray) {

    inquirer
      .prompt([
      {
        name: "whatID",
        type: "list",
        message: "Which item would you like to buy? ",
        choices: productArray
      },
      {
          name: "whatQuantity",
          type: "number",
          message: "How many units of the product would you like to buy? "
      }
        ])
      .then(function(answer) {
          // setting the sql query based on the answers above
        var query = "SELECT stock_quantity,price,product_sales FROM products WHERE product_name = ?";
        connection.query(query, [answer.whatID], function(err, res) {

            // this is the stock quantity that the db has before any transaction is made
            var stock_quantity = res[0].stock_quantity;

            // this is the current product_sales that the db has before any transaction is made
            var cur_sales = res[0].product_sales;

            // this is what we will set as the new quantity after the transaction
            var new_db_quantity = stock_quantity - answer.whatQuantity

            // if we have more than the user requested above...
            if (answer.whatQuantity <= stock_quantity) {

                // math for total cost goes here
                var price_math = res[0].price * answer.whatQuantity;
                // adding the transaction cost + previous product_sales
                var new_sales_total = cur_sales + price_math;
                console.log("We have enough quantity! \n")

                // setting our database with the new subtracted quantity (and setting the price of total sales in the )
                var query = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?"
                connection.query(query, [new_db_quantity, new_sales_total, answer.whatID], function(err, res) {
                    console.log("Updating database...\n")

                    // returning to the user what we have left and what they paid
                    console.log("We now have " + new_db_quantity + " item(s) left\n")
                    console.log("you paid $" + price_math)
                    initialPrompt();
                }) 
            } else {
                // if the user wants more than the db has, then we cannot fulfill it
                console.log("We do not have enough quantity to satisfy your order :( ")
                initialPrompt();
            }
        });
      });
  }

  // I aso don't have error handling for when the quantity they select is 0 or negative number or a number at all....
