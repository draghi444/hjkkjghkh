'use strict';


angular.module('ChessMasterProApp')
    .factory("chessRef", ["$firebaseArray",
  function ($firebaseArray) {

            var chessRef = new Firebase('https://burning-heat-7639.firebaseio.com/');
            // var chessController = new Chess.Controller(chessRef);
            return chessRef;
  }
])
    .controller('MainCtrl', ["$scope", "$firebaseObject", "$firebaseArray", "chessRef", "chessFunctions", 
        function ($scope, $firebaseObject, $firebaseArray, chessRef, chessFunctions) {

            //doua functii de pus in servicii
            /*
            function draw_image(context, x, y, image) {
                var base_image = new Image();
                base_image.src = image;
                base_image.onload = function () {
                    context.drawImage(base_image, x, y);
                }
            }

            function getBoardClickPosition(x, y, BOARD) {
                var xPos = x / 70;
                var yPos = y / 70;
                return BOARD[yPos][xPos];
            }

*/

            var Chess = {};
            var canvas = $("#canvas0").get(0);

            Chess.BOARD_WIDTH = 8;
            Chess.BOARD_HEIGHT = 8;

            Chess.BLOCK_SIZE_PIXELS = 70;
            Chess.BOARD_HEIGHT_PIXELS = Chess.BOARD_HEIGHT * Chess.BLOCK_SIZE_PIXELS;
            Chess.BOARD_WIDTH_PIXELS = Chess.BOARD_WIDTH * Chess.BLOCK_SIZE_PIXELS;
            Chess.BLOCK_BORDER_COLOR = "#484848";

            Chess.clicks = [];
            for (var i = 0; i < 8; i++) {
                Chess.clicks[i] = [];
            }

            Chess.BOARD = [];
            Chess.BOARD[0] = ["wlt", "wlc", "wln", "wrm", "wrf", "wrn", "wrc", "wrt"];
            Chess.BOARD[1] = ["wp1", "wp2", "wp3", "wp4", "wp5", "wp6", "wp7", "wp8"];
            Chess.BOARD[2] = [" ", " ", " ", " ", " ", " ", " ", " "];
            Chess.BOARD[3] = [" ", " ", " ", " ", " ", " ", " ", " "];
            Chess.BOARD[4] = [" ", " ", " ", " ", " ", " ", " ", " "];
            Chess.BOARD[5] = [" ", " ", " ", " ", " ", " ", " ", " "];
            Chess.BOARD[6] = ["bp1", "bp2", "bp3", "bp4", "bp5", "bp6", "bp7", "bp8"];
            Chess.BOARD[7] = ["blt", "blc", "bln", "brm", "brf", "brn", "brc", "brt"];


            Chess.Board = function (BOARD, canvas) {
                this.board = BOARD;
                this.context = canvas.getContext('2d');

                var self = this;
                self.writeToFirebase(chessRef);
                self.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);

                chessRef.on('value', function (snap) {
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
                chessRef.set({
                    board: this.board,
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
                       // this.context.fillText(this.board[y][x], (x * Chess.BLOCK_SIZE_PIXELS) + 10, ((y + 1) * Chess.BLOCK_SIZE_PIXELS) - 25);
                        var xx = (x * Chess.BLOCK_SIZE_PIXELS);
                        var yy = ((y + 1) * Chess.BLOCK_SIZE_PIXELS) - 70;
                        var image;
                        if (this.board[y][x] == "blc" || this.board[y][x] == "brc") {
                            image = '../images/black_horse.png'
                            chessFunctions.draw_image(this.context, xx, yy, image);
                        }
                        if (this.board[y][x] == "brm") {
                            image = '../images/black_king.png'
                            chessFunctions.draw_image(this.context, xx, yy, image);
                        }
                        if (this.board[y][x] == "bln" || this.board[y][x] == "brn") {
                            image = '../images/black-mad.png'
                            chessFunctions.draw_image(this.context, xx, yy, image);
                        }
                        if (this.board[y][x] == "wlt" || this.board[y][x] == "wrt") {
                            image = '../images/white_tower.png'
                            chessFunctions.draw_image(this.context, xx, yy, image);
                        }
                        if (this.board[y][x] == "wln" || this.board[y][x] == "wrn") {
                            image = '../images/white-mad.png'
                            chessFunctions.draw_image(this.context, xx, yy, image);
                        }
                        if (this.board[y][x].match(/wp.*/)) {
                            image = '../images/white-pawn.png'
                            chessFunctions.draw_image(this.context, xx, yy, image);
                        }

                    }
                }
            }

            ///Main///
            var newBoard = new Chess.Board(Chess.BOARD, canvas);
            newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);
            canvas.addEventListener('click', handleClick);


            var activeClick = false;
            var attackPiece;
            var attackPosX;
            var attackPosY;

            function handleClick(e) {

                var c = canvas.getContext("2d");
                var x = Math.floor(e.offsetX / 70) * 70;
                var y = Math.floor(e.offsetY / 70) * 70;
                var xClick = x / Chess.BLOCK_SIZE_PIXELS;
                var yClick = y / Chess.BLOCK_SIZE_PIXELS;

                if (Chess.clicks[yClick][xClick] == "1") {
                    Chess.clicks[yClick][xClick] = "0";
                    activeClick = false;
                    attackPiece = null;
                    attackPosX = null;
                    attackPosY = null;
                    c.clearRect(x, y, 70, 70);
                    newBoard.draw(0, Chess.BOARD_WIDTH, 0, Chess.BOARD_HEIGHT);
                } else {
                    if (activeClick) {
                        activeClick = false;
                        Chess.clicks[attackPosY][attackPosX] = "0";
                        newBoard.board[attackPosY][attackPosX] = " ";
                        newBoard.board[yClick][xClick] = attackPiece;
                        newBoard.writeToFirebase(chessRef);
                        attackPiece = null;
                        attackPosX = null;
                        attackPosY = null;
                    } else {
                        if (chessFunctions.getBoardClickPosition(x, y, newBoard.board) !== " ") {
                            activeClick = true;
                            Chess.clicks[yClick][xClick] = "1";
                            attackPiece = chessFunctions.getBoardClickPosition(x, y, newBoard.board);
                            attackPosX = xClick;
                            attackPosY = yClick;
                            c.globalAlpha = 0.2;
                            c.fillStyle = "blue";
                            c.fillRect(x, y, 70, 70);
                            c.stroke();
                        }
                    }
                }

                console.log('mutare:[' + xClick + '][' + yClick + '] click: ' + Chess.clicks[yClick][xClick] + ' attack-piece:' + attackPiece + ' attX:' + attackPosX + ' attY:' + attackPosY + '  piesa:' + chessFunctions.getBoardClickPosition(x, y, newBoard.board));
            }
                }]);