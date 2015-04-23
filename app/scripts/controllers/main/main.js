'use strict';


angular.module('ChessMasterProApp')
    .factory("chessRef", ["$firebaseArray", "$routeParams", 
  function ($firebaseArray, $routeParams) {

            var roomId = $routeParams.roomid;
            var chessRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + roomId + '/');
            // var chessController = new Chess.Controller(chessRef);
            return chessRef;
  }
])
    .controller('MainCtrl', ["$scope", "$firebaseObject", "$firebaseArray", "chessRef", "chessFunctions", "$timeout", "$route", "$routeParams", "$location",
        function ($scope, $firebaseObject, $firebaseArray, chessRef, chessFunctions, $timeout, $route, $routeParams, $location) {

            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;
            
            
            var playRoomId = $routeParams.roomid;
            
            

            var chessRefForAuth = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/');
            var authData = chessRefForAuth.getAuth();

            if (!chessRefForAuth.getAuth()) {
                $location.path("/login");
                // $scope.$apply();
            } else {


                var resize;
                jQuery(document).ready(function () {
                    window.onresize = function () {
                        update();
                    }
                    function update() {
                        var canvasNode = document.getElementById('canvas0');
                        canvasNode.width = canvasNode.parentNode.clientWidth;
                        canvasNode.height = canvasNode.width;
                        resize = canvasNode.width;
                        Chess.BLOCK_SIZE_PIXELS = Math.round(parseInt(resize) / 8);
                        Chess.BOARD_HEIGHT_PIXELS = Chess.BOARD_HEIGHT * Chess.BLOCK_SIZE_PIXELS;
                        Chess.BOARD_WIDTH_PIXELS = Chess.BOARD_WIDTH * Chess.BLOCK_SIZE_PIXELS;
                        newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);
                    }
                    Metronic.init(); // init metronic core componets
                    Layout.init(); // init layout
                    Demo.init(); // init demo(theme settings page)
                    // Index.init(); // init index page
                    Tasks.initDashboardWidget(); // init tash dashboard widget
                });


                $scope.authData = authData;
                if (authData) {
                    console.log("User " + authData.uid + " is logged in with " + authData.provider);
                } else {
                    console.log("User is logged out");
                }

                //actions/////
                $scope.logOut = function () {
                    var uid = authData.uid;
                    var deleteUserRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/room1/users/' + uid);
                    deleteUserRef.set({
                        uid: null
                    });
                    chessRefForAuth.unauth();
                }

                var turn;
                $scope.newGame = function () {
                    newBoard.board = Chess.SBOARD;
                    newBoard.writeToFirebase(chessRef);

                    var turnRef = new Firebase('https://burning-heat-7639.firebaseio.com/turn');
                    turn = "w";
                    $scope.turn = turn;
                    turnRef.set(turn);
                    turnRef.once('value', function (snapshot) {
                        turn = snapshot.val();
                    });
                }
                
                $scope.goToRooms = function () {
                    
                    var deleteUserRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/users/' + authData.uid);
                    deleteUserRef.set({
                        uid: null
                    });                        
                }
                
                
                /////////////


                var Chess = {};
                var canvas = $("#canvas0").get(0);

                Chess.BOARD_WIDTH = 8;
                Chess.BOARD_HEIGHT = 8;

                Chess.BLOCK_SIZE_PIXELS = 50;
                Chess.BOARD_HEIGHT_PIXELS = Chess.BOARD_HEIGHT * Chess.BLOCK_SIZE_PIXELS;
                Chess.BOARD_WIDTH_PIXELS = Chess.BOARD_WIDTH * Chess.BLOCK_SIZE_PIXELS;
                Chess.BLOCK_BORDER_COLOR = "#484848";

                Chess.clicks = [];
                for (var i = 0; i < 8; i++) {
                    Chess.clicks[i] = [];
                }

                Chess.SBOARD = [];

                Chess.SBOARD[0] = ["wlt", "wlc", "wln", "wrm", "wrf", "wrn", "wrc", "wrt"];
                Chess.SBOARD[1] = ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"];
                Chess.SBOARD[2] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.SBOARD[3] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.SBOARD[4] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.SBOARD[5] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.SBOARD[6] = ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"];
                Chess.SBOARD[7] = ["blt", "blc", "bln", "brm", "brf", "brn", "brc", "brt"];

                Chess.EBOARD = [];
                Chess.EBOARD[0] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.EBOARD[1] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.EBOARD[2] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.EBOARD[3] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.EBOARD[4] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.EBOARD[5] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.EBOARD[6] = [" ", " ", " ", " ", " ", " ", " ", " "];
                Chess.EBOARD[7] = [" ", " ", " ", " ", " ", " ", " ", " "];


                Chess.Board = function (BOARD, canvas) {
                    // this.board = BOARD;
                    this.context = canvas.getContext('2d');

                    var self = this;
                    // self.writeToFirebase(chessRef);
                    // self.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);

                    chessRef.child('/board').on('value', function (snap) {
                        console.log('value');
                        self.board = snap.val().board;
                        console.log(self.board[0]);
                        console.log(self.board[1]);
                        console.log(self.board[2]);
                        console.log(self.board[3]);
                        console.log(self.board[4]);
                        console.log(self.board[5]);
                        console.log(self.board[6]);
                        console.log(self.board[7]);
                        console.log('--------------------------------------------------------------');
                        self.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);

                    });
                };

                Chess.Board.prototype.writeToFirebase = function (chessRef) {
                    chessRef.child('/board').set({
                        board: this.board
                    });
                };
                Chess.Board.prototype.draw = function (a, b, c, d) {

                    this.context.clearRect(0, 0, Chess.BOARD_WIDTH_PIXELS, Chess.BOARD_HEIGHT_PIXELS);

                    for (var x = a; x < b; x++) {
                        for (var y = c; y < d; y++) {
                            var colorValue = ((x + y) % 2 == 0) ? 'grey' : 'white';
                            var left = x * Chess.BLOCK_SIZE_PIXELS;
                            var top = y * Chess.BLOCK_SIZE_PIXELS;
                            this.context.globalAlpha = 1;
                            this.context.fillStyle = colorValue;
                            this.context.fillRect(left, top, Chess.BLOCK_SIZE_PIXELS, Chess.BLOCK_SIZE_PIXELS);
                            this.context.lineWidth = 1;
                            this.context.strokeStyle = Chess.BLOCK_BORDER_COLOR;
                            this.context.strokeRect(left, top, Chess.BLOCK_SIZE_PIXELS, Chess.BLOCK_SIZE_PIXELS);
                            this.context.font = "30px Arial";
                            this.context.fillStyle = colorValue == 'grey' ? 'white' : 'grey';
                            this.context.fillText(this.board[y][x], (x * Chess.BLOCK_SIZE_PIXELS), ((y + 1) * Chess.BLOCK_SIZE_PIXELS));



                        }
                    }
                }

                ///Main///

                var newBoard = new Chess.Board(Chess.EBOARD, canvas);
                // newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);
                canvas.addEventListener('click', handleClick);

                var activeClick = false;
                var attackPiece;
                var attackPosX;
                var attackPosY;
                var color;
console.log('room:' + playRoomId + ' ' + authData.uid);
                
                var ColorRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/users/' + authData.uid);
                console.log('ColorRef:');
                console.log(ColorRef);
                
                ColorRef.once('value', function (snapshot) {
                    console.log('color:');
                    console.log(snapshot.val());
                    color = snapshot.val().color;
                    $scope.color = color;
                   // $scope.$apply();

                });

                var turnRef = new Firebase('https://burning-heat-7639.firebaseio.com/turn');
                turnRef.once('value', function (snapshot) {
                    turn = snapshot.val();
                    $scope.turn = turn;
                    $scope.$apply();
                });

                function handleClick(e) {

                    //var turnRef = new Firebase('https://burning-heat-7639.firebaseio.com/turn');
                    turnRef.once('value', function (snapshot) {
                        turn = snapshot.val();
                        $scope.turn = turn;
                        $scope.$apply();
                    });

                    if (authData) {
                        console.log("User " + authData.uid + " is logged in with " + authData.provider);
                    } else {
                        console.log("User is logged out");
                    }

                    var c = canvas.getContext("2d");

                    var x = Math.floor(e.offsetX / Chess.BLOCK_SIZE_PIXELS) * Chess.BLOCK_SIZE_PIXELS;
                    var y = Math.floor(e.offsetY / Chess.BLOCK_SIZE_PIXELS) * Chess.BLOCK_SIZE_PIXELS;
                    var xClick = x / Chess.BLOCK_SIZE_PIXELS;
                    var yClick = y / Chess.BLOCK_SIZE_PIXELS;
                    var textPiece = newBoard.board[yClick][xClick];

                    if (Chess.clicks[yClick][xClick] == "1") {
                        Chess.clicks[yClick][xClick] = "0";
                        activeClick = false;
                        attackPiece = null;
                        attackPosX = null;
                        attackPosY = null;
                        c.clearRect(x, y, Chess.BLOCK_SIZE_PIXELS, Chess.BLOCK_SIZE_PIXELS);
                        newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);
                    } else {
                        if (activeClick) {

                            var isAllowed = chessFunctions.moveAllowed(attackPiece, attackPosX, attackPosY, xClick, yClick, newBoard.board);
                            if (isAllowed) {
                                activeClick = false;
                                Chess.clicks[attackPosY][attackPosX] = "0";
                                newBoard.board[attackPosY][attackPosX] = " ";
                                newBoard.board[yClick][xClick] = attackPiece;
                                newBoard.writeToFirebase(chessRef);
                                attackPiece = null;
                                attackPosX = null;
                                attackPosY = null;
                                if (turn == "w") {
                                    turn = "b";
                                } else {
                                    turn = "w";
                                }
                                turnRef.set(
                                    turn
                                );

                            }
                        } else {

                            if (chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS) !== " ") {
                                if (String(textPiece)[0] == String(color)[0] && turn == String(color)[0]) {
                                    activeClick = true;
                                    Chess.clicks[yClick][xClick] = "1";
                                    attackPiece = chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS);
                                    attackPosX = xClick;
                                    attackPosY = yClick;
                                    c.globalAlpha = 0.2;
                                    c.fillStyle = "blue";
                                    c.fillRect(x, y, Chess.BLOCK_SIZE_PIXELS, Chess.BLOCK_SIZE_PIXELS);
                                    c.stroke();
                                }
                            }
                        }
                    }


                    console.log('mutare:[' + xClick + '][' + yClick + '] click: ' + Chess.clicks[yClick][xClick] + ' attack-piece:' + attackPiece + ' attX:' + attackPosX + ' attY:' + attackPosY + '  piesa:' + chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS));
                }
            }
                }]);