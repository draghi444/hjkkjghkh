'use strict';


angular.module('ChessMasterProApp')
    .controller('LoginCtrl', ["$scope", "$rootScope", "$route", "$routeParams", "$location", "$firebaseObject",
        function ($scope, $rootScope, $route, $routeParams, $location, $firebaseObject) {

            var credentials = $scope.credentials = {
                username: "",
                password: ""
            }

            var color;
            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;


            var ref = new Firebase('https://burning-heat-7639.firebaseio.com/');

            var numberUsersLogged;
            var UsersLogged;

            var UsersRef = new Firebase('https://burning-heat-7639.firebaseio.com/users/');
            UsersRef.once('value', function (snapshot) {
                numberUsersLogged = snapshot.numChildren();
                UsersLogged = snapshot.val();
            });


            $scope.logIn = function () {
                if (numberUsersLogged < 2) {
                    console.log(numberUsersLogged);
                    ref.authWithPassword({
                        email: $scope.credentials.username,
                        password: $scope.credentials.password
                    }, function (error, authData) {
                        if (error) {
                            console.log("Login Failed!", error);
                        } else {
                            console.log("Authenticated successfully with payload:", authData);
                            $location.path("/main");

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
                } else {
                    alert('Game already in progress!');
                }
            }

  }]);