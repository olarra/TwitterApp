var myapp =  angular.module('myApp', ['ngRoute','angularUtils.directives.dirPagination'])

//Define Routing for app
//Uri /SeeMyFollowers -> template see_followers.html and Controller AddOrderController
//Uri /SeeMyNetwork -> template see_network.html and Controller AddOrderController
myapp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/SeeMe', {
        templateUrl: 'templates/see_me.html',
        controller: 'SeeMe_Controller'
    }).
      when('/SeeMyFollowers', {
          templateUrl: 'templates/see_followers.html',
    		  controller: 'SeeMyFollowers_Controller'
	}).
      when('/SeeMyNetwork', {
		      templateUrl: 'templates/see_network.html',
		      controller: 'SeeMyNetwork_Controller'
      }).
      when('/', {
          templateUrl : 'templates/home.html',
          controller  : 'Home_Controller'
        }).
      otherwise({
		      redirectTo: '/'
      });
}]);



myapp.controller('NavCtrl', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
});

myapp.controller('FormCtrl', function($scope,$http) {

  $scope.setMe = function() {
    $http.post('/setMe/' + $scope.username ).success(function(data) {
				if(data == "INVALID"){
          $scope.result = "No valid user";}
          else{$scope.result = "User validated";}
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

  $scope.setNetwork = function() {
    $http.post('/setNetwork/' + $scope.username ).success(function(data) {
      $scope.result = "Network crawled";
			})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

  $scope.setRelationship = function() {
    $http.get('/setRelationship/' ).success(function(data) {
      $scope.result = "Graph Generated";
      })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  };

  $scope.checkUsername = function() {
   if ($scope.result == "User validated" || $scope.result == "Network crawled") { // your question said "more than one element"
     return false;
   }
    else {
     return true;
    }
  };

});


myapp.controller('Home_Controller', function($scope) {

	$scope.message = 'Technologies utilisées';

});

myapp.controller('SeeMe_Controller', function($scope,$http) {
	$scope.message = 'My account information';
  // Obtenemos todos los datos de la base de datos
  $http.get('/getMe').success(function(data) {
    console.log('ME: ' + data[0]);
    $scope.me = data[0];

    $scope.checkMe = function() {
     if ($scope.me.length == 0) { // your question said "more than one element"
       return false;
     }
      else {
       return true;
      }
    };
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });




});


myapp.controller('SeeMyFollowers_Controller', function($scope,$http) {

	$scope.message = 'My followers information';

  $http.get('/getNetwork').success(function(data) {
    $scope.followers = data[0].follower;


    $scope.checkFollowers = function() {
     if ($scope.followers.length == 0) { // your question said "more than one element"
       return false;
     }
      else {
       return true;
      }
    };
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });





});


myapp.controller('SeeMyNetwork_Controller', function($scope,$http) {

	$scope.message = 'Graph using forced layout from D3JS';
  $http.get('/getRelationship').success(function(data) {
			//Width nd height
			var w = 400;
			var h = 500;
  $scope.nodes = data[0].nodes;

			//Original data
    console.log(data[0].nodes);
    console.log(data[0].links);

//******************************************************************************************

    var colors = d3.scale.category10();
    var width = 500,
        height = 300

    var svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        .gravity(0.1)
        .charge(-120)
        .linkDistance(70)
        .size([width, height]);


      force
          .nodes(data[0].nodes)
          .links(data[0].links)
          .start();

      var link = svg.selectAll(".link")
          .data(data[0].links)
          .enter().append("line")
          .attr("class", "link");

      var node = svg.selectAll(".node")
          .data(data[0].nodes)
          .enter().append("g")
          .attr("class", "node")
          .call(force.drag);

      var circle = node.append("circle")
          .attr("r", 9.5)
          .style("fill", function(d, i) {
          return colors(i);
          }).call(force.drag);

      var location = node.append("text")
          .attr("class", "location")
          .text(function(d) { return d.location; });

      var label = node.append("text")
      .style("text-anchor", "middle")
      .style("fill", "#555")
      .style("font-family", "sans-serif;")
      .style("font-size", "12px")
      .text(function(d) { return d.name; });

      force.on("tick", function() {

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        circle
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        location
            .attr("dx", function(d) { return d.x +1 ; })
            .attr("dy", function(d) { return d.y -30 ; });

        label
            .attr("x", function(d) { return d.x ; })
            .attr("y", function(d) { return d.y - 15; });
      });
  });

  $scope.checkNodes = function() {
    console.log("taille: " +$scope.nodes.length);
   if ($scope.nodes.length == 0) { // your question said "more than one element"
     return false;
   }
    else {
     return true;
    }
  };

});
