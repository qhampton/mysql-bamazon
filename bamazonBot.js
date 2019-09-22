var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "94582H@mpt0n",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});


function exit() {
    connection.end();
    console.log("Thank you for visiting Bamazon!");
}

function SHOWitem() {
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        let itemForSale = [];
        let idForSale = [];
        res.forEach(function (i) {
            console.log("ID: " + i.item_id + " | " + "Product: " + i.product_name + " | " + "Department: " + i.department_name + " | " + "Price: $" + i.price + "Quantity: " + " | " + i.stock_quantity);
            console.log("-----------------------------------");
            itemForSale.push(i.item_name);
            idForSale.push(i);
        });
        inquirer.prompt([{
            name: "choice",
            type: 'list',
            message: "What would you like to buy?",
            choices: itemForSale
        }, {
            type: "input",
            name: "amount",
            message: "How many did you want?"
        }]).then(answers => {
                updateAmount(answers.amount, answers.choice); mainMenu();
        });
    });
}

function updateAmount(amount, name) {
    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: amount
    }, {
        item_name: name
    }], function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        mainMenu();
    });
}

function mainMenu() {
    SHOWitem();
    inquirer.prompt([{
        type: "list",
        choices: ["BUY", "EXIT"],
        message: "What would you like to do?",
        name: 'choice'
    }]).then(answers => {
        switch (answers.choice) {
            case 'BUY':
                SHOWitem();
                break;
            case 'EXIT':
                exit();
                break;
            default:
                console.log("??");
        }
    });
}
//When app first loads call mainMenu
mainMenu();