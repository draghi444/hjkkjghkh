'use strict';


angular
    .module('ChessMasterProApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'chessServices'
  ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/main/:roomid', {
                templateUrl: 'views/main/main.html',
                controller: 'MainCtrl'
            })
            .when('/', {
                templateUrl: 'views/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/rooms', {
                templateUrl: 'views/rooms/rooms.html',
                controller: 'RoomsCtrl'
            
            })
            .otherwise({
                redirectTo: '/'
            });

    });