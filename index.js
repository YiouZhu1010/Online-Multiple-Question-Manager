
var mysql = require("mysql");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var crypto = require('crypto');
var fs = require('fs');



app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"csci2720test",
  database: "CSCI2720"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

app.get('/list',function(req,res){
  	con.query('SELECT * FROM questions',function(err,results){
  	if(err) throw err;
  	res.json(results);
});
});

app.post('/login', bodyParser.urlencoded({extended: false}));
app.post('/login', function(req, res) {
  con.query('SELECT * FROM users WHERE username = ?',req.body.username,function(err,result){
    if(err)throw err;
    if(result.length==1){
      var password = req.body.password;
      var hmac = crypto.createHash('sha256');
      hmac.update(password);
     
      if(result[0].password == hmac.digest("hex")){
        res.send("Login Successfully");
      } else res.send("Wrong username or password");
    }else res.send("Wrong username or password");
  });
});





// con.end(function(err) {
//   // The connection is terminated gracefully
//   // Ensures all previously enqueued queries are still
//   // before sending a COM_QUIT packet to the MySQL server.
// });


app.listen(8081);