
var express = require('express');
var sql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var expenseApp = require('./expenseApp/expenseApp.js');

var pool = sql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'classicmodels'
});

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use( express.static( __dirname + "/public"));

app.get('/', function( request, response ){

});

app.get('/users', function( request, response ){
	//console.log("i recieved the get request!");
	getContacts( request, response );
});

app.get('/user/:id', function(request, response){
	getContactById( request, response );
});
app.post('/user/:id', function(request, response){
	//console.log( request.body );
	updateContactById( request, response );
	
});

app.get('/crud', function( request, response ){
	//console.log("i recieved the get request!");
	getUsers( request, response );
});
app.post('/crud', function( request, response ){
	//console.log("i recieved the get request!");
	addUser( request, response );
});

app.delete('/crud/:id', function( request, response ){
	//console.log("i recieved the get request!");
	//console.log( request.params.id );
	deleteUser( request, response );
});

/* expense tracker */
app.get('/expenses', function( request, response ){
	expenseApp.expenseMethods.getAllExpenses( pool, request, response );
});
app.post('/expenses/add-new', function( request, response ){
	expenseApp.expenseMethods.addNewExpense( pool, request, response );
});
app.delete('/expenses/:id', function( request, response ){
	expenseApp.expenseMethods.removeExpenses( pool, request, response );
});






app.listen(1702, function(){
	console.log('site running on port 1702');
});

function getContactById(req, res){
	if (!req.params.id)
	{
		return
	}
	pool.getConnection( function(err, conn){
		conn.query("select * from contacts where ID='"+ req.params.id +"'", function(err, row) {
             if (!err)
			{
				//res.render('edit-contact', { row: row[0] });
				res.json( row[0] );
			}else{
				console.log('Error while performing the query..check function getContactById() for more details..');
			}
         })
	});
}

function updateContactById(req, res){
	//console.log( req.body);
	pool.getConnection( function(err, conn){
		conn.query("UPDATE contacts SET name='"+ req.body.name +"', email='"+ req.body.email +"' , number='"+req.body.number+"' WHERE ID='"+req.body.ID + "'", function(err, row) {
             if (!err)
			{
				//res.render('edit-contact', { row: row[0] });
				//console.log( row )
				res.json( row[0] );
			}else{
				console.log('Error while performing the query..check function updateContactById() for more details..');
			}
         })
	});
}

function getContacts(req, res){
	pool.getConnection( function(err, conn){
		conn.query("select * from contacts", function(err, rows) {
             if (!err)
			{
				res.json( rows );
			}else{
				console.log('Error while performing the query..check function getContacts() for more details..');
			}
         })
	});
}

function getUsers(req, res){
	pool.getConnection( function(err, conn){
		conn.query("select * from users", function(err, rows) {
             if (!err)
			{
				res.json( rows );
			}else{
				console.log('Error while performing the query..check function getUsers() for more details..');
			}
			conn.release();
         });
	});
}

function addUser(req,res){
	pool.getConnection( function(err, conn){
		conn.query("insert into users(username) values('"+ req.body.username +"')", function(err, rows) {
             if (!err)
			{
				res.json( rows );
			}else{
				console.log('Error while performing the query..check function addUser() for more details..');
			}
			conn.release();
         });
	});
}

function deleteUser(req,res){
	pool.getConnection( function(err, conn){
		conn.query("delete from users where id='"+ req.params.id +"'", function(err, rows) {
             if (!err)
			{
				res.json( rows );
			}else{
				console.log('Error while performing the query..check function deleteUser() for more details..');
			}
			conn.release();
         });
	});
}