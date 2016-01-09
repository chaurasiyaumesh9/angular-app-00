


exports.expenseMethods = {
	getAllExpenses: getAllExpenses,
	addNewExpense: addNewExpense
}

function getAllExpenses(sqlpool, req, res){
	sqlpool.getConnection( function(err, conn){
		conn.query("select e_date, e_amount, e_venue from events", function(err, rows) {
			 if (!err)
			{
				res.json( rows );
			}else{
				console.log('Error while performing the query..check function getAllExpenses() for more details..');
			}
		 })
	});
}

function addNewExpense(sqlpool, req,res){
	console.log( req.body );
	sqlpool.getConnection( function(err, conn){
		conn.query("insert into events(e_date, e_amount, e_venue) values('"+ req.body.e_date +"','"+ req.body.e_amount +"','"+ e_venue +"')", function(err, rows) {
             if (!err)
			{
				res.json( rows );
			}else{
				console.log('Error while performing the query..check function addNewExpense() for more details..');
			}
			conn.release();
         });
	});
}