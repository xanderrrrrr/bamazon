// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    runPrompt();
});
  
function runPrompt() {
    inquirer
      .prompt([
      {
        name: "whatID",
        type: "input",
        message: "What is the ID of the product that you'd like to buy? ",
      },
      {
          name: "whatQuantity",
          type: "input",
          message: "How many units of the product would you like to buy? "
      }
        ])
      .then(function(answer) {
        var query = "SELECT stock_quantity,price  FROM products WHERE item_id = ?";
        connection.query(query, [answer.whatID], function(err, res) {
            var stock_quantity = res[0].stock_quantity;
            var new_db_quantity = stock_quantity - answer.whatQuantity
            

            if (answer.whatQuantity <= stock_quantity) {
                // math for total cost goes here
                var price_math = res[0].price * answer.whatQuantity
                console.log("We have enough quantity, successfully ordered \n")
                var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
                connection.query(query, [new_db_quantity, answer.whatID], function(err, res) {
                    console.log("Updating database...\n")
                    console.log("We now have " + new_db_quantity + " item(s) left")
                    console.log("you paid $" + price_math)
                }) 
            } else {
                console.log("We do not have enough quantity to satisfy your order :( ")
            }

            connection.end();
        // switch (answer.action) {
        // case "Find songs by artist":
        //   artistSearch();
        //   break;
  
        // case "Find all artists who appear more than once":
        //   multiSearch();
        //   break;
  
        // case "Find data within a specific range":
        //   rangeSearch();
        //   break;
  
        // case "Search for a specific song":
        //   songSearch();
        //   break;
  
        // case "Find artists with a top song and top album in the same year":
        //   songAndAlbumSearch();
        //   break;
        });
      });
  }

