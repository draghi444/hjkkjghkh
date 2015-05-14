//'use strict';
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


            var chessRefForAuth = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/');
            var authData = chessRefForAuth.getAuth();

            if (!chessRefForAuth.getAuth()) {
                $location.path("/");
                // $scope.$apply();
            } else {
                var gameover = "0";
                $scope.username = authData.password.email.replace(/@.*/, '');
                $scope.fullScreenFlag = true;
                var playRoomId = $routeParams.roomid;
                var turn;



                def1 = $.Deferred();
                var turnRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/turn');
                turnRef.on('value', function (snapshot) {
                    console.log('DEFERRED!!!!!');
                    turn = snapshot.val();
                    def1.resolve(turn);
                    //$scope.$apply();
                });
                var ColorRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/users/' + authData.uid);
                def2 = $.Deferred();
                ColorRef.on('value', function (snapshot) {
                    color = snapshot.val().color;
                    def2.resolve(color);
                    // $scope.$apply();
                });

                $.when(def1, def2).done(function (turn, color) {
                    $scope.turn = turn;
                    $scope.color = color;
                    console.log('turn + color: ' + turn + ' ' + color);
                    // $scope.$apply();

                    var Chess = {};

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



                            var countKings = 0;
                            for (var i = 0; i < 8; i++) {
                                for (var j = 0; j < 8; j++) {
                                    if (self.board[i][j].match(/[a-z]m/)) {
                                        countKings++;
                                        console.log('un king');
                                    }
                                }
                            }
                            if (countKings != 2) {
                                console.log('GAME OVER');
                                gameover = "1";
                            } else {
                                console.log('PLAY' + color);
                            }

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
                                //this.context.fillText(this.board[y][x], (x * Chess.BLOCK_SIZE_PIXELS), ((y + 1) * Chess.BLOCK_SIZE_PIXELS));
                                var xx = (x * Chess.BLOCK_SIZE_PIXELS);
                                var yy = ((y + 1) * Chess.BLOCK_SIZE_PIXELS) - Chess.BLOCK_SIZE_PIXELS;
                                var image;
                                var aa = Chess.BLOCK_SIZE_PIXELS;


                                if (color == "white") {
                                    yy = (7 * Chess.BLOCK_SIZE_PIXELS) - yy;
                                    xx = (7 * Chess.BLOCK_SIZE_PIXELS) - xx;
                                }


                                if (this.board[y][x] == "blc" || this.board[y][x] == "brc") {
                                    image = '../images/svg/Chess_ndt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "brm") {
                                    image = '../images/svg/Chess_kdt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "brf") {
                                    image = '../images/svg/Chess_qdt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "bln" || this.board[y][x] == "brn") {
                                    image = '../images/svg/Chess_bdt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "blt" || this.board[y][x] == "brt") {
                                    image = '../images/svg/Chess_rdt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x].match(/bp.*/)) {
                                    image = '../images/svg/Chess_pdt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }


                                if (this.board[y][x] == "wlt" || this.board[y][x] == "wrt") {
                                    image = '../images/svg/Chess_rlt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "wln" || this.board[y][x] == "wrn") {
                                    image = '../images/svg/Chess_blt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x].match(/wp.*/)) {
                                    image = '../images/svg/Chess_plt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "wlc" || this.board[y][x] == "wrc") {
                                    image = '../images/svg/Chess_nlt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "wlc" || this.board[y][x] == "wrc") {
                                    image = '../images/svg/Chess_nlt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "wrm") {
                                    image = '../images/svg/Chess_klt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }
                                if (this.board[y][x] == "wrf") {
                                    image = '../images/svg/Chess_qlt45.svg';
                                    chessFunctions.draw_image(this.context, xx, yy, image, aa);
                                }

                            }
                        }
                    }
                    var canvas = $("#canvas0").get(0);
                    var newBoard = new Chess.Board(Chess.EBOARD, canvas);



                    Chess.Board.prototype.writeToFirebase = function (chessRef) {
                        chessRef.child('/board').set({
                            board: this.board
                        });
                    };




                    var ColorRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/users/' + authData.uid);
                    console.log('ColorRef:');
                    console.log(ColorRef);

                    ColorRef.once('value', function (snapshot) {
                        console.log('color:');
                        console.log(snapshot.val());
                        color = snapshot.val().color;
                        $scope.color = color;
                        //$scope.$apply();

                    });

                    var turnRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/turn');
                    turnRef.on('value', function (snapshot) {
                        turn = snapshot.val();
                        $scope.turn = turn;
                        // $scope.$apply();
                    });


                    var resize;
                    jQuery(document).ready(function () {
                        window.onresize = function () {
                            update();

                        }

                        function update() {
                            console.log($location.path().substring(0, 5));
                            if ($location.path().substring(0, 5) == '/main') {
                                console.log('update');

                                var canvasNode = document.getElementById('canvas0');
                                canvasNode.width = canvasNode.parentNode.clientWidth;
                                canvasNode.height = canvasNode.width;
                                resize = canvasNode.width;
                                Chess.BLOCK_SIZE_PIXELS = Math.round(parseInt(resize) / 8);
                                Chess.BOARD_HEIGHT_PIXELS = Chess.BOARD_HEIGHT * Chess.BLOCK_SIZE_PIXELS;
                                Chess.BOARD_WIDTH_PIXELS = Chess.BOARD_WIDTH * Chess.BLOCK_SIZE_PIXELS;
                                newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);

                                //check for fullscreen
                                if (!window.screenTop && !window.screenY) {
                                    $scope.fullScreenFlag = true;
                                    $scope.$apply();
                                } else {
                                    $scope.fullScreenFlag = false;
                                    $scope.$apply();
                                }
                            }
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



                    //actions
                    $scope.logOut = function () {
                        console.log('logged out from room');
                        var uid = authData.uid;
                        var deleteUserRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/users/' + uid);
                        deleteUserRef.set({
                            uid: null
                        });
                        chessRefForAuth.unauth();
                    }

                    $scope.goToRooms = function () {

                        var deleteUserRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/users/' + authData.uid);
                        deleteUserRef.set({
                            uid: null
                        });
                        $location.path("/rooms");
                        // $scope.$apply();
                    }

                    $scope.newGame = function () {
                        newBoard.board = Chess.SBOARD;
                        gameover = "0";
                        newBoard.writeToFirebase(chessRef);


                        var turnRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/turn');
                        turn = "w";
                        $scope.turn = turn;
                        turnRef.set(turn);
                        // turnRef.once('value', function (snapshot) {
                        //        turn = snapshot.val();
                        //    });
                    }
                    /////////////



                    //var Chess = {};
                    //var canvas = $("#canvas0").get(0);

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
                    Chess.SBOARD[0] = ["wrt", "wrc", "wrn", "wrf", "wrm", "wln", "wlc", "wlt"];
                    Chess.SBOARD[1] = ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"];
                    Chess.SBOARD[2] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.SBOARD[3] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.SBOARD[4] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.SBOARD[5] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.SBOARD[6] = ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"];
                    Chess.SBOARD[7] = ["blt", "blc", "bln", "brf", "brm", "brn", "brc", "brt"];

                    Chess.JBOARD = [];
                    Chess.JBOARD[0] = ["blt", "blc", "bln", "brm", "brf", "brn", "brc", "brt"];
                    Chess.JBOARD[1] = ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"];
                    Chess.JBOARD[2] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.JBOARD[3] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.JBOARD[4] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.JBOARD[5] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.JBOARD[6] = ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"];
                    Chess.JBOARD[7] = ["wlt", "wlc", "wln", "wrm", "wrf", "wrn", "wrc", "wrt"];

                    Chess.EBOARD = [];
                    Chess.EBOARD[0] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.EBOARD[1] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.EBOARD[2] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.EBOARD[3] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.EBOARD[4] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.EBOARD[5] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.EBOARD[6] = [" ", " ", " ", " ", " ", " ", " ", " "];
                    Chess.EBOARD[7] = [" ", " ", " ", " ", " ", " ", " ", " "];






                    ///Main///

                    // var newBoard = new Chess.Board(Chess.EBOARD, canvas);





                    // newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);
                    var newcontext = canvas.getContext('2d');
                    //if (color == "white") {
                    //    } else {
                    //        newcontext.translate(200,200);
                    //        newcontext.rotate(180 * Math.PI / 180);
                    //        newcontext.translate(-200,-200);
                    //    }


                    var activeClick = false;
                    var attackPiece;
                    var attackPosX;
                    var attackPosY;
                    var color;
                    console.log('room:' + playRoomId + ' ' + authData.uid);




                    function handleClick(e) {

                        // var turnRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/turn');

                        turnRef.on('value', function (snapshot) {
                            turn = snapshot.val();
                            $scope.turn = turn;
                            $timeout(function () {
                                $scope.$apply();
                            }, 0);
                            // $scope.$apply();

                        });




                        if (authData) {
                            console.log("User " + authData.uid + " is logged in with " + authData.provider);
                        } else {
                            console.log("User is logged out");
                        }

                        var c = canvas.getContext("2d");

                        var x = Math.floor(e.offsetX / Chess.BLOCK_SIZE_PIXELS) * Chess.BLOCK_SIZE_PIXELS;
                        var y = Math.floor(e.offsetY / Chess.BLOCK_SIZE_PIXELS) * Chess.BLOCK_SIZE_PIXELS;
                        var blueX = x;
                        var blueY = y;
                        console.log('x:' + x + 'y:' + y);
                        var xClick = x / Chess.BLOCK_SIZE_PIXELS;
                        var yClick = y / Chess.BLOCK_SIZE_PIXELS;
                        var textPiece = newBoard.board[yClick][xClick];


                        if (color == "white") {
                            console.log('white-click');
                            xClick = 7 - xClick;
                            yClick = 7 - yClick;

                            x = xClick * Chess.BLOCK_SIZE_PIXELS;
                            y = yClick * Chess.BLOCK_SIZE_PIXELS;
                            console.log('x:' + x + 'y:' + y);
                            textPiece = newBoard.board[yClick][xClick];
                            console.log(chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS));
                            console.log('txtpiece:' + textPiece);

                        }




                        if (gameover != "1") {

                            if (Chess.clicks[yClick][xClick] == "1") {
                                console.log('f1');
                                Chess.clicks[yClick][xClick] = "0";
                                activeClick = false;
                                attackPiece = null;
                                attackPosX = null;
                                attackPosY = null;
                                c.clearRect(x, y, Chess.BLOCK_SIZE_PIXELS, Chess.BLOCK_SIZE_PIXELS);
                                newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);
                            } else {
                                if (activeClick) {
                                    console.log('f2');

                                    var isAllowed = chessFunctions.moveAllowed(attackPiece, attackPosX, attackPosY, xClick, yClick, newBoard.board, chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS));
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
                                            // $scope.turn = "b";
                                        } else {
                                            turn = "w";
                                            // $scope.turn = "w";
                                        }
                                        turnRef.set(
                                            turn
                                        );
                                        // $scope.$apply();

                                    }
                                } else {
                                    console.log('f3');

                                    if (chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS) !== " ") {
                                        console.log('ok');
                                        console.log(String(textPiece)[0] + ' ' + turn + ' ' + String(color)[0]);
                                        if (String(textPiece)[0] == String(color)[0] && turn == String(color)[0]) {
                                            console.log('ok2');
                                            activeClick = true;
                                            Chess.clicks[yClick][xClick] = "1";
                                            attackPiece = chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS);
                                            attackPosX = xClick;
                                            attackPosY = yClick;
                                            c.globalAlpha = 0.2;
                                            c.fillStyle = "blue";
                                            console.log('x:' + x + 'y:' + y);
                                            c.fillRect(blueX, blueY, Chess.BLOCK_SIZE_PIXELS, Chess.BLOCK_SIZE_PIXELS);
                                            c.stroke();
                                        }
                                    }
                                }
                            }
                        }


                        console.log('mutare:[' + xClick + '][' + yClick + '] click: ' + Chess.clicks[yClick][xClick] + ' attack-piece:' + attackPiece + ' attX:' + attackPosX + ' attY:' + attackPosY + '  piesa:' + chessFunctions.getBoardClickPosition(x, y, newBoard.board, Chess.BLOCK_SIZE_PIXELS));


                    }





                    canvas.addEventListener('click', handleClick);


                    //Chat controller
                    var chatRef = new Firebase('https://burning-heat-7639.firebaseio.com/rooms/' + playRoomId + '/chat/');
                    $scope.user = authData.uid;
                    $scope.messages = $firebaseArray(chatRef);

                    $scope.addMessage = function () {
                        $scope.messages.$add({
                            from: $scope.user,
                            content: $scope.message
                        });
                        $scope.message = "";
                        $("#chatDiv")[0].scrollTop = $("#chatDiv")[0].scrollHeight;
                    };


                    $scope.eraseChat = function () {
                        chatRef.remove();
                    };

                    $scope.messages.$loaded(function () {
                        if ($scope.messages.length === 0) {
                            $scope.messages.$add({
                                from: "Chess Master",
                                content: "Welcome! Good luck"
                            });
                        }
                    });



                });
            }
                }]);