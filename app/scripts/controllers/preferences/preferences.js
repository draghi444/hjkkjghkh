'use strict';


angular.module('ChessMasterProApp')
    .controller('PrefCtrl', ["$scope", "$rootScope", "$route", "$routeParams", "$location", "$firebaseObject", "$timeout", "$firebaseAuth",
        function ($scope, $rootScope, $route, $routeParams, $location, $firebaseObject, $timeout, $firebaseAuth) {


            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;


            jQuery(document).ready(function () {
                Metronic.init(); // init metronic core componets
                Layout.init(); // init layout
                Demo.init(); // init demo(theme settings page)
                // Index.init(); // init index page
                // $scope.$apply();
            });

            var chessRefForAuth = new Firebase('https://burning-heat-7639.firebaseio.com/');
            var authData = chessRefForAuth.getAuth();

            if (!chessRefForAuth.getAuth()) {
                console.log('prefs');
                $location.path("/");
            } else {


                var gamesTotal;
                var gamesWon;
                var gamesLost;
                var statisticsRef = new Firebase('https://burning-heat-7639.firebaseio.com/users/' + authData.uid + '/statistics');
                statisticsRef.once('value', function (snapshot) {
                    console.log('STATS:');
                    console.log(snapshot.val().gamesTotal);
                    gamesTotal = snapshot.val().gamesTotal;
                    gamesWon = snapshot.val().gamesWon;
                    $scope.username = snapshot.val().nickname;
                    $scope.gamesTotal = gamesTotal;
                    $scope.gamesWon = gamesWon;
                    var gamesLost = gamesTotal - gamesWon;
                    $scope.gamesLost = gamesLost;
                    if(gamesTotal != 0) {
                    $scope.rank = Math.floor((gamesWon/gamesTotal) * 10);
                    } else { $scope.rank = 0; }
                    
                    $timeout(function () {
                        $scope.$apply();
                    }, 0);
                });




                var fromLocation = $routeParams.fromLocation;
                console.log('PREFERENCES:');
                console.log(fromLocation.substring(5));
                console.log(authData);


                var passwords = $scope.passwords = {
                    oldPassword: "",
                    newPassword: ""
                }


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

                $scope.logOutPref = function () {
                    console.log('logged out from prefs');
                    chessRefForAuth.unauth();
                }


                $scope.goBack = function () {
                    if (fromLocation == 'rooms') {
                        $location.path("/rooms");
                    } else {
                        var room = 'main/' + fromLocation.substring(5);
                        console.log(room);
                        $location.path(room);
                    }
                }


                $scope.changePass = function () {
                    chessRefForAuth.changePassword({
                        email: authData.password.email,
                        oldPassword: passwords.oldPassword,
                        newPassword: passwords.newPassword
                    }, function (error) {
                        if (error === null) {
                            console.log("Password changed successfully");
                            alert('Password changed successfully');

                        } else {
                            console.log("Error changing password:", error);
                            alert('Error changing password: ' + error);
                        }
                    });
                }


                $scope.setNickname = function () {
                    var statisticsRef = new Firebase('https://burning-heat-7639.firebaseio.com/users/' + authData.uid);
                    if($scope.nickname != '') {
                    statisticsRef.child('statistics/nickname').set($scope.nickname);
                        alert('Nickname changed!');
                    }
                }





            }


                }]);