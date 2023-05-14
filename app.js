const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");

const {Client} = require('pg');
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"root",
    database:"tokkensDb"
});

client.connect();
let count = 2;

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/",function(req,res){
    
    client.query('SELECT * FROM tokkenList',function(err,foundItems){
        if(!err){
            res.render("tokkenDashboard",{tokken:foundItems.rows,count:count});
        } else {
            console.log(err);
        }
    });
});

app.post("/",function(req,res){
    if(req.body.nextTokkenBtn == "plusOne"){
        count++;
        res.redirect("/");
    }
    if(req.body.generateTokkenBtn == "generateTokken"){
        let sql = 'INSERT INTO tokkenList (pateintname,patientphonenumber) VALUES ($1, $2);';
        let patientName = req.body.patientName;
        let patientPhoneNumber = req.body.phoneNumber;
        client.query(sql,[patientName,patientPhoneNumber],function(err,result){
            if(!err){
                res.redirect("/");
            } else {
                console.log(err);
            }
        });

    }
});

app.get("/currentToken",function(req,res){
    var sql = "SELECT * FROM tokkenList WHERE"
    client.query('SELECT * FROM tokkenList WHERE ',function(err,foundItems){
        if(!err){
            res.render("tokkenDashboard",{tokken:foundItems.rows,count:count});
        } else {
            console.log(err);
        }
    });
    res.render("currentToken");
})

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});