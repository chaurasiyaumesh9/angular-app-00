var scotchApp = angular.module('scotchApp', ['ngRoute']);


scotchApp.config(function($routeProvider) {
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
			templateUrl : 'pages/user.html',
			controller  : 'userController'
		})
		.when('/crud', {
			templateUrl : 'pages/crud.html',
			controller  : 'crudController'
		});
});
scotchApp.controller('mainController', function($scope) {
	// create a message to display in our view
	$scope.message = 'Everyone come and see how good I look!';
});

scotchApp.controller('aboutController', function($scope) {
	$scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function($scope) {
	$scope.message = 'Contact us! JK. This is just a demo.';
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
