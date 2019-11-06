// setting my required dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table")

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
    let config,data,output;
 
    data = [
    ['Department ID', 'Department Name', 'Overhead Costs', "Product Sales", "Total Profit"],
    ['1A', '1B', '1C', '1d', '1e']
    ];
 
    var query = "SELECT department_id,department_name,overhead_costs FROM departments;";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res)

    })


    output = table(data, config);
    
    console.log(output);
}

