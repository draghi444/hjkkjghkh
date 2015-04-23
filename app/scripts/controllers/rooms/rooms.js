'use strict';


angular.module('ChessMasterProApp')
    .controller('RoomsCtrl', ["$scope", "$rootScope", "$route", "$routeParams", "$location", "$firebaseObject",
        function ($scope, $rootScope, $route, $routeParams, $location, $firebaseObject) {

            jQuery(document).ready(function () {
                Metronic.init(); // init metronic core componets
                Layout.init(); // init layout
                Demo.init(); // init demo(theme settings page)
                // Index.init(); // init index page
            });




            var chessRefForAuth = new Firebase('https://burning-heat-7639.firebaseio.com/');
            var authData = chessRefForAuth.getAuth();

            if (!chessRefForAuth.getAuth()) {
                $location.path("/login");
            } else {

                var rooms = {};
                var roomsRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms');

                roomsRef.once('value', function (snapshot) {
                    snapshot.forEach(function (data) {
                        console.log("The " + data.key() + " is " + data.val());
                        console.log(data.val().users);
                        var dataobj = data.val();
                        dataobj.number = snapshot.child('/' + data.key() + '/users').numChildren();
                        console.log(dataobj);
                        rooms[data.key()] = dataobj;

                    });
                    $scope.rooms = rooms;
                    $scope.$apply();
                });



                $scope.joinIn = function (roomName) {

                    var color;








                    if (rooms[roomName].number < 2) {
                        if (rooms[roomName].number == 0) {
                            color = "white";
                        } else {
                            for (var i in rooms[roomName].users) {
                                color = rooms[roomName].users[i].color;
                            }
                            if (color == "white") {
                                color = "black";
                            } else {
                                color = "white";
                            }
                        }


                         $location.path("/main");


                        roomsRef.child('/' + roomName + '/users').child(authData.uid).set({
                            provider: authData.provider,
                            name: authData.password.email.replace(/@.*/, ''),
                            color: color
                        });

                        // $scope.$apply();


                    } else {
                        console.log('room full');
                    }
                }









            }


  }]);