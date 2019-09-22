let mysql = require("mysql");
let inquirer = require("inquirer");
let cliTable = require('cli-table3');

let connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "uziman12",

    database: "greenChile"
});

// connecting  to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;

    // run the start function after the connection is made to prompt the user
    console.log("Bamazon!");
    displayItems();
});

connection.query('Select * from productsss', function(err, res) {
        console.log("dave's check")
        if (err) throw err
        else console.log(res)
    })
    // display all items being sold

let displayItems = function() {

    connection.query("SELECT * FROM productsss", function(err, res) {
        if (err) throw err;
        let table = new cliTable({
            head: ["id", "product", "department", "price", "quantity"],
            colWidths: [12]
        });
        //    for loop must go here
        for (let i = 0; i < res.length; i++) {
            table.push([res[i].id], [res[i].product], [res[i].department], [res[i].price]);

        };
        console.log(table.toString());
        console.log("Hey there ho there");
    });
}
displayItems();

// once we have the items, prompt the user for what they'd like to purchase!!

// function to allow user to choose which item to puchase

function chooseItem() {

    inquirer
        .prompt([{
            type: "input",
            name: "id",
            message: "Enter ID of item you'd like to purchase"
        }])
        .then(function(answer1) {
            let choice = answer1.id;
            connection.query("SELECT * FROM product WHERE id=?", selection, function(err, res) {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("No such item, sorry");
                    chooseItem();
                } else {

                    inquirer
                        .prompt([{
                            type: "input",
                            name: "quantity",
                            message: "How many"
                        }]).then(function(answer2) {
                            let quantity = answer2.quantity;
                            if (quantity > res[0].stock_quantity) {
                                console.log("Sorry, only " + res[0].stock_quantity + "left");
                                chooseItem();
                            } else {
                                console.log("");
                                console.log(res[0].product = " bought");
                                console.log(quantity + " qty @ $" + res[0].price);

                                let newQuantity = res[0].stock_quantity - quantity;
                                connection.query(
                                    "UPDATE product SET quantity = " + newQuantity + " WHERE id = " + res[0].id,
                                    function(err, resUpdate) {
                                        if (err) throw err;
                                        console.log("Thanks for your order! It's processing!");
                                    }
                                );
                            }
                        });
                }
            });
        });
}