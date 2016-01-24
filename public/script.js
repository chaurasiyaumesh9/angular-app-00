var scotchApp = angular.module('scotchApp', ['ngRoute']);


scotchApp.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'mainController'
		})

		// route for the about page
		.when('/about', {
			templateUrl : 'pages/about.html',
			controller  : 'aboutController'
		})

		// route for the contact page
		.when('/contact', {
			templateUrl : 'pages/contact.html',
			controller  : 'contactController'
		})
		.when('/users', {
			templateUrl : 'pages/users.html',
			controller  : 'usersController'
		})
		.when('/user/:id', {
			templateUrl : '/pages/user.html',
			controller  : 'userController'
		})
		.when('/crud', {
			templateUrl : 'pages/crud.html',
			controller  : 'crudController'
		})
		.when('/expenses', {
			templateUrl : 'pages/expenses.html',
			controller  : 'expensesController'
		})
		.when('/expenses/add-new', {
			templateUrl : '/pages/add-new-expense.html',
			controller  : 'expensesController'
		});

		if(window.history && window.history.pushState){
            //$locationProvider.html5Mode(true); will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

         // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

         // if you don't wish to set base URL then use this
         $locationProvider.html5Mode({
                 enabled: true,
                 requireBase: false
          });
        }
});
scotchApp.controller('mainController', function($scope) {
	// create a message to display in our view
	$scope.message = 'Everyone come and see how good I look!';
});

scotchApp.controller('aboutController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function($scope, $http) {
	$scope.message = 'Contact us! JK. This is just a demo.';
	//$scope.contact = {};
	$scope.showSuccessAlert = false;
	$scope.submitContactDetails = function(){
		//console.log( $scope.contact );
		$http.post('/contact', $scope.contact ).then( function( response ){
			console.log('data posted : ' , response.data );
			// display success page
			$scope.showSuccessAlert = true;
			$scope.contact = {};
		}, function( response ){
			 if (! angular.isObject( response.data ) || ! response.data.message) {
				return( $q.reject( "An unknown error occurred." ) );
			}
			// Otherwise, use expected error message.
			return( $q.reject( response.data.message ) );
		});
	}
});
scotchApp.controller('expensesController', function($scope, $http, expenseService) {
	$scope.message = 'An awesome app to track the expenses over the weekend!';
	$scope.expenses = [];
	loadRemoteData();

	$scope.addNewExpense = function(){   
		
		expenseService.addNewExpense( $scope.expense ).then( function(){ 
			loadRemoteData(); $scope.showSuccessAlert = true; 
		}, function(errorMessage ){ 
			console.warn( errorMessage );
		});
		clearform();
	}

	function getIdsToBeDeleted() {
		var arr = [];
		for (var i=0;i<$scope.expenses.length ;i++ )
		{
			if ( $scope.expenses[i].selectSingle )
			{
				arr.push( $scope.expenses[i]["e_Id"] );
			}
		}
		return arr.join();
		
	}

	$scope.removeExpenses = function(){
		console.log( getIdsToBeDeleted() );
		expenseService.removeExpenses( getIdsToBeDeleted() ).then( function(){ 
			loadRemoteData();
			$scope.showSuccessAlert = true;
		}, function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}
	$scope.checkAll = function(){
		if (!$scope.selectAll) {
            $scope.selectAll = true;
        } else {
            $scope.selectAll = false;
        }
        angular.forEach($scope.expenses, function (expense) {
            expense.selectSingle = $scope.selectAll;
        });
	}

	$scope.toggleDelete = function(){
		for (var i=0;i<$scope.expenses.length ;i++ )
		{
			if ( $scope.expenses[i].selectSingle )
			{
				return true;
			}
		}
		return false;
	}
	function clearform(){
		$scope.expense = {};
	}

	function applyRemoteData( list ) {
        $scope.expenses = list;
    }
    function loadRemoteData() {
        expenseService.getAllExpenses().then(function( response ) {
            applyRemoteData( response );
        });
    }
});


scotchApp.controller('crudController', function($scope, $http, userService ) {
	$scope.message = 'An example of angularJS service!';
	$scope.usersList = [];
	loadRemoteData();

	$scope.addUser = function(){                
		userService.addUser( $scope.user.username).then(loadRemoteData, function(errorMessage ){ 
			console.warn( errorMessage );
		});
		clearform();
	}
	$scope.deleteUser = function( user ){
		userService.deleteUser( user.id ).then(loadRemoteData, function(errorMessage ){ 
			console.warn( errorMessage );
		});
		clearform();
	}



	function clearform(){
		$scope.user = {};
	}

	function applyRemoteData( list ) {
        $scope.usersList = list;
    }
    function loadRemoteData() {
        userService.getUsers().then(function( response ) {
            applyRemoteData( response );
        });
    }
});

scotchApp.controller('usersController', function($scope, $http) {
	$scope.message = 'Fetching and showing user list on this page!';
	
	fetchContactList();
	
	function fetchContactList(){
		$http.get('/users').success( function( response ){
			//console.log('i recied the data requested - ', response);
			$scope.contactList = response;
		});
		
	}

});

scotchApp.controller('userController', function($scope,  $http, $routeParams) {
	$scope.message = 'This is a individual user page!';
	var userId = $routeParams.id;

	fetchContactById( userId );
	
	function fetchContactById( id ){
		$http.get('/user/' + id  ).success( function( response ){
			$scope.contact = response;
		});
	}

	$scope.submitForm = function(){
		$http.post('/user/' + $scope.contact.ID, $scope.contact ).success( function( response ){
			//console.log('data posted : ' , response);
			// display success page
			$scope.showSuccessAlert = true;
		});
	}

	function updateContactById(){
		
	}

});



scotchApp.service("expenseService", function($http, $q){
	return({
        getAllExpenses: getAllExpenses,
		addNewExpense: addNewExpense,
		removeExpenses: removeExpenses
    });

	function getAllExpenses() {
        var request = $http({
            method: "get",
            url: "/expenses",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }

	function addNewExpense( expense ){
		var request = $http({
            method: "post",
            url: "/expenses/add-new",
            params: {
                action: "add"
            },
            data: {
                expense: expense
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}
	function removeExpenses( id ) {
		console.log('ids : ', id);
        var request = $http({
            method: "delete",
            url: "/expenses/" + id,
            params: {
                action: "delete"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }


    function handleError( response ) {
        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
            ) {
            return( $q.reject( "An unknown error occurred." ) );
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    function handleSuccess( response ) {
	    return( response.data );
	}


});


scotchApp.service("userService", function($http, $q){
	return({
        addUser: addUser,
        getUsers: getUsers,
        deleteUser: deleteUser
    });

	function addUser( username ){
		var request = $http({
            method: "post",
            url: "/crud",
            params: {
                action: "add"
            },
            data: {
                username: username
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}

	function getUsers() {
        var request = $http({
            method: "get",
            url: "/crud",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function deleteUser( id ) {
        var request = $http({
            method: "delete",
            url: "/crud/" + id,
            params: {
                action: "delete"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function handleError( response ) {
        if (
            ! angular.isObject( response.data ) ||
            ! response.data.message
            ) {
            return( $q.reject( "An unknown error occurred." ) );
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    function handleSuccess( response ) {
	    return( response.data );
	}


});
