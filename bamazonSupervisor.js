// setting my required dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table")

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

function initialPrompt() {
    inquirer.prompt({
        name: "action",
        type: "list",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    })
    .then(function(actionAnswer) {
        switch (actionAnswer.action) {
            case "View Product Sales by Department":
              viewSales();
              break;
      
            case "Create New Department":
                // function
              break;
            
            case "Exit":
                connection.end();
                break;
        }
    });
}

function viewSales() {
    connection.query("SELECT prod.department_name, SUM(prod.product_sales) as product_sales, dept.overhead_costs as overhead_costs, SUM(prod.product_sales) - dept.overhead_costs as total_profit FROM products prod INNER JOIN departments dept ON prod.department_name = dept.department_name GROUP BY department_name, overhead_costs;", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['department_name', 'product_sales', 'overhead_costs', 'total_profit']
        });

        for (let i = 0; i < res.length; i++) {
            table.push(
                [
                    res[i].department_name,
                    res[i].product_sales,
                    res[i].overhead_costs,
                    res[i].total_profit
                ]);
        }

        console.log(table.toString());
        initialPrompt();
    })
}

