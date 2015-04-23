'use strict';


angular.module('ChessMasterProApp')
    .controller('LoginCtrl', ["$scope", "$rootScope", "$route", "$routeParams", "$location", "$firebaseObject",
        function ($scope, $rootScope, $route, $routeParams, $location, $firebaseObject) {
            
jQuery(document).ready(function () {
                    Metronic.init(); // init metronic core componets
                    Layout.init(); // init layout
                    Demo.init(); // init demo(theme settings page)
                    // Index.init(); // init index page
                });
            
            
            var credentials = $scope.credentials = {
                username: "",
                password: ""
            }

            var color;
            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;


            var ref = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/room1/');

            var numberUsersLogged;
            var UsersLogged;

            var UsersRef = new Firebase('https://burning-heat-7639.firebaseio.com/users/');
            ref.child('users').once('value', function (snapshot) {
                numberUsersLogged = snapshot.numChildren();
                console.log('children:' + numberUsersLogged);
                UsersLogged = snapshot.val();
            });


            $scope.logIn = function () {
                    ref.authWithPassword({
                        email: $scope.credentials.username,
                        password: $scope.credentials.password
                    }, function (error, authData) {
                        if (error) {
                            console.log("Login Failed!", error);
                        } else {
                            console.log("Authenticated successfully with payload:", authData);
                            $location.path("/rooms");

                            if (numberUsersLogged < 1) {
                                color = "black";
                            } else {
                                color = "white";
                            }
                            ref.child("users").child(authData.uid).set({
                                provider: authData.provider,
                                name: authData.password.email.replace(/@.*/, ''),
                                color: color
                            });

                            $scope.$apply();
                        }
                    });

            }

  }]);