'use strict';


angular.module('ChessMasterProApp')
    .controller('RoomsCtrl', ["$scope", "$rootScope", "$route", "$routeParams", "$location", "$firebaseObject", "$timeout",
        function ($scope, $rootScope, $route, $routeParams, $location, $firebaseObject, $timeout) {


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
            console.log('ROOMS: authData:');
            console.log(authData);
            console.log($location.path());

            if (!chessRefForAuth.getAuth()) {
                console.log('rooms');
                $location.path("/");
            } else {

                $scope.fullScreenFlag = true;
                $scope.username = authData.password.email.replace(/@.*/, '');
                var rooms = {};
                var roomsRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms');
                var roomsList = [];


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


                roomsRef.once('value', function (snapshot) {
                    snapshot.forEach(function (data) {
                        roomsList.push(data.key());

                        var dataobj = data.val();
                        dataobj.number = snapshot.child('/' + data.key() + '/users').numChildren();
                        rooms[data.key()] = dataobj;

                    });
                    $timeout(function () {
                        $scope.rooms = rooms;
                        $scope.$apply();
                    }, 0);
                });



                $scope.logOutRooms = function () {
                    console.log('logged out from rooms');
                    chessRefForAuth.unauth();
                }



                var startBoard = [];
                startBoard[0] = ["wrt", "wrc", "wrn", "wrf", "wrm", "wln", "wlc", "wlt"];
                startBoard[1] = ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"];
                startBoard[2] = [" ", " ", " ", " ", " ", " ", " ", " "];
                startBoard[3] = [" ", " ", " ", " ", " ", " ", " ", " "];
                startBoard[4] = [" ", " ", " ", " ", " ", " ", " ", " "];
                startBoard[5] = [" ", " ", " ", " ", " ", " ", " ", " "];
                startBoard[6] = ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"];
                startBoard[7] = ["blt", "blc", "bln", "brf", "brm", "brn", "brc", "brt"];

                var boardObject = {
                    board: startBoard
                };

                String.prototype.inList = function (list) {
                    return (list.indexOf(this.toString()) != -1)
                }

                var newRoomName = "";
                $scope.newRoomName = newRoomName;
                $scope.roomExistsFlag = false;
                $scope.compareText = "";

                $scope.createRoom = function () {
                    console.log('creating room:');
                    console.log($scope.newRoomName);
                    console.log(roomsList);
                    $scope.compareText = $scope.newRoomName;
                    if ($scope.newRoomName.inList(roomsList)) {
                        $scope.roomExistsFlag = true;
                        console.log('ESTE in LISTA');
                    } else {
                        if ($scope.newRoomName !== "") {
                            var newRoomRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/');
                            newRoomRef.child('/' + $scope.newRoomName).set({
                                name: $scope.newRoomName,
                                board: boardObject,
                                turn: "w"
                            });
                            $scope.newRoomName = "";
                            $scope.compareText = "";
                            $scope.roomExistsFlag = false;


                            roomsRef.once('value', function (snapshot) {
                                snapshot.forEach(function (data) {
                                    console.log("The " + data.key() + " is " + data.val());


                                    roomsList.push(data.key());

                                    var dataobj = data.val();
                                    dataobj.number = snapshot.child('/' + data.key() + '/users').numChildren();
                                    console.log(dataobj);
                                    rooms[data.key()] = dataobj;

                                });
                                $timeout(function () {
                                    $scope.rooms = rooms;
                                    $scope.$apply();
                                }, 0);
                            });

                        }
                    }
                }

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

                        roomsRef.child('/' + roomName + '/users').child(authData.uid).set({
                            provider: authData.provider,
                            name: authData.password.email.replace(/@.*/, ''),
                            color: color
                        });
                        //$location.path("/main");
                    }
                }


                $scope.refreshRooms = function () {
                    roomsRef.once('value', function (snapshot) {
                        snapshot.forEach(function (data) {
                            console.log("The " + data.key() + " is " + data.val());


                            roomsList.push(data.key());

                            var dataobj = data.val();
                            dataobj.number = snapshot.child('/' + data.key() + '/users').numChildren();
                            console.log(dataobj);
                            rooms[data.key()] = dataobj;

                        });
                        $timeout(function () {
                            $scope.rooms = rooms;
                            $scope.$apply();
                        }, 0);
                    });
                }

            }


                }]);