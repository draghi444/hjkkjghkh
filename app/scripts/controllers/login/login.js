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

            $scope.fullScreenFlag = true;
            //check for fullscreen
            window.onresize = function () {
                if (!window.screenTop && !window.screenY) {
                    $scope.fullScreenFlag = true;
                    $scope.$apply();
                } else {
                    $scope.fullScreenFlag = false;
                    $scope.$apply();
                }

            }


            var credentials = $scope.credentials = {
                username: "",
                password: ""
            }

            var registerCredentials = $scope.registerCredentials = {
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
                        alert("Login Failed!");
                    } else {
                        console.log("Authenticated successfully with payload:", authData);
                        $location.path("/rooms");
                        $scope.$apply();
                    }
                }, {
                    remember: "sessionOnly"
                });

            }


            $scope.openRegistrationFlag = false;
            $scope.openRegistration = function () {
                $scope.openRegistrationFlag = true;
            }

            $scope.cancelRegistration = function () {
                $scope.openRegistrationFlag = false;
            }






            $scope.registerUser = function () {
                UsersRef.createUser({
                    email: $scope.registerCredentials.username,
                    password: $scope.registerCredentials.password
                }, function (error, userData) {
                    if (error) {
                        switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                        }
                    } else {
                        console.log("Successfully created user account with uid:", userData.uid);
                        UsersRef.authWithPassword({
                            email: $scope.registerCredentials.username,
                            password: $scope.registerCredentials.password
                        }, function (error, authData) {
                            if (error) {
                                console.log("Login Failed!", error);
                            } else {
                                console.log("Authenticated successfully with payload:", authData);
                                UsersRef.child("users").child(authData.uid).set({
                                    provider: authData.provider,
                                    name: authData.password.email.replace(/@.*/, ''),
                                    statistics: {
                                        gamesTotal: 0,
                                        gamesWon: 0,
                                        nickname: authData.password.email.replace(/@.*/, '')
                                    }
                                });
                                $location.path("/rooms");
                                $scope.$apply();
                            }
                        }, {
                            remember: "sessionOnly"
                        });
                    }
                });
            }

  }]);