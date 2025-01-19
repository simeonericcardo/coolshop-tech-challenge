'use strict'
const fs=require("fs");
const parser=require("csv-parser");

const args=process.argv.slice(2);
if (args.length != 1) {process.exit(1);}

function processCSV(file_path) {
    let orders=[];

    fs.createReadStream(file_path).pipe(parser())
    .on("data", (row) => {
        const order = {
            id: parseInt(row.Id),
            articleName: row["ArticleName"],
            quantity: parseInt(row.Quantity),
            unitPrice: parseFloat(row["Unit price"]),
            percentageDiscount: parseFloat(row["Percentage discount"]),
            buyer: row.Buyer, 
            totalPrice: parseFloat(row.Quantity * row["Unit price"])
        };
        orders.push(order);
    })
    .on("end", () => {
        const maxTotalPrice = orders.reduce((max, obj) => {
            return obj.totalPrice > max.totalPrice ? obj : max
        })

        const maxQuantity = orders.reduce((max, obj) => {
            return obj.quantity > max.quantity ? obj : max
        })

        const maxDiff = orders.reduce((max, obj) => {
            return (obj.totalPrice*obj.percentageDiscount/100) > (max.totalPrice*max.percentageDiscount/100) ? obj : max
        })

        console.log("Record con importo totale più alto: " + JSON.stringify(maxTotalPrice));
        console.log("Record con quantità più alta: " + JSON.stringify(maxQuantity));
        console.log("Record con maggior differenza tra totale senza sconto e totale con sconto: " + JSON.stringify(maxDiff));

    })
}

processCSV(args[0]);