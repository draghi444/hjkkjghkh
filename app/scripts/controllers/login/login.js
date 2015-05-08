'use strict';


angular.module('ChessMasterProApp')
    .controller('LoginCtrl', ["$scope", "$rootScope", "$route", "$routeParams", "$location", "$firebaseObject",
        function ($scope, $rootScope, $route, $routeParams, $location, $firebaseObject) {
            
jQuery(document).ready(function () {
                    Metronic.init();
                    Layout.init();
                    Demo.init();
                    // Index.init();
                });
             
            var credentials = $scope.credentials = {
                username: "",
                password: ""
            }

            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;

            var UsersRef = new Firebase('https://burning-heat-7639.firebaseio.com/');
            $scope.logIn = function () {
                    UsersRef.authWithPassword({
                        email: $scope.credentials.username,
                        password: $scope.credentials.password
                    }, function (error, authData) {
                        if (error) {
                            console.log("Login Failed!", error);
                        } else {
                            console.log("Authenticated successfully with payload:", authData);
                            UsersRef.child("users").child(authData.uid).set({
                                provider: authData.provider,
                                name: authData.password.email.replace(/@.*/, ''),
                            });
                            
                            $location.path("/rooms");
                            $scope.$apply();
                        }
                    });

            }

  }]);