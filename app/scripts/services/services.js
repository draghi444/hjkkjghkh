'use strict';

angular.module('chessServices', []);

angular.module('chessServices').factory('chessFunctions', ["$http", "$q",
        function ($http, $q) {

        function draw_image(context, x, y, image, a) {
            var base_image = new Image();
            base_image.src = image;  
            base_image.onload = function () {
                context.drawImage(base_image, x, y, a, a);
            }
        }

        function getBoardClickPosition(x, y, BOARD, l) {
            var xPos = x / l;
            var yPos = y / l;
            console.log('services:');
            console.log(l);
            console.log(x);
            console.log(y);
            return BOARD[yPos][xPos];
        }

        function moveAllowed(attackPiece, attackPosX, attackPosY, xClick, yClick, BOARD) {
            //console.log('attackPiece:' + attackPiece + ' attackPosX:' + attackPosX + '  attackPosY:' + attackPosY + ' [' + xClick + '][' + yClick + ']');
            //cal//////
            if (attackPiece.match(/[a-z]c/)) {
                if (attackPosX == xClick + 1 || attackPosX == xClick - 1) {
                    if (attackPosY == yClick - 2 || attackPosY == yClick + 2) {
                        return true;
                    }
                }
                if (attackPosX == xClick + 2 || attackPosX == xClick - 2) {
                    if (attackPosY == yClick - 1 || attackPosY == yClick + 1) {
                        return true;
                    }
                }
            }

            //pion//////
            if (attackPiece.match(/[a-z][0-9]/)) {
                if (Math.abs(attackPosX - xClick) < 2 && Math.abs(attackPosY - yClick) < 2) {
                    return true;
                }
            }

            //tura//////
            if (attackPiece.match(/[a-z]t/)) {
                var obstacle = "0";
                if (attackPosX == xClick || attackPosY == yClick) {
                    if (attackPosX == xClick) {
                        if (attackPosY < yClick) {
                            for (var i = attackPosY + 1; i < yClick; i++) {
                                if (BOARD[i][attackPosX] != " ") {
                                    obstacle = "1";
                                }
                            }
                        }
                        if (attackPosY > yClick) {
                            for (var k = yClick + 1; k < attackPosY; k++) {
                                if (BOARD[k][attackPosX] != " ") {
                                    obstacle = "1";
                                }
                            }
                        }
                    }
                    if (attackPosY == yClick) {
                        if (attackPosX < xClick) {
                            for (var j = attackPosY + 1; j < xClick; j++) {
                                if (BOARD[attackPosY][j] != " ") {
                                    obstacle = "1";
                                }
                            }
                        }
                        if (attackPosX > xClick) {
                            for (var l = xClick + 1; l < attackPosX; l++) {
                                if (BOARD[attackPosY][l] != " ") {
                                    obstacle = "1";
                                }
                            }
                        }
                    }

                    if (obstacle == "0") {
                        return true;
                    }
                }
            }
            return false;
        }

        return {

            draw_image: function (context, x, y, image, a) {
                return draw_image(context, x, y, image, a);
            },

            getBoardClickPosition: function (x, y, BOARD, l) {
                return getBoardClickPosition(x, y, BOARD, l);
            },

            moveAllowed: function (attackPiece, attackPosX, attackPosY, xClick, yClick, BOARD) {
                return moveAllowed(attackPiece, attackPosX, attackPosY, xClick, yClick, BOARD);
            },



        }

    }]);