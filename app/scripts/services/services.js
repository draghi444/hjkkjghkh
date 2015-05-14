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
            return BOARD[yPos][xPos];
        }

        function moveAllowed(attackPiece, attackPosX, attackPosY, xClick, yClick, BOARD, attackedPiece) {
            //console.log('attackPiece:' + attackPiece + ' attackPosX:' + attackPosX + '  attackPosY:' + attackPosY + ' [' + xClick + '][' + yClick + ']');
            //cal//////
            console.log(attackedPiece);
            if (attackPiece.match(/[a-z]c/) && String(attackPiece)[0] != String(attackedPiece)[0]) {
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
            if (attackPiece.match(/[a-z][0-9]/) && String(attackPiece)[0] != String(attackedPiece)[0]) {
                if (String(attackPiece)[0] == "w") {
                    if ((((yClick - attackPosY) == 1) && (xClick == attackPosX) && String(attackedPiece)[0] == " ") || (((yClick - attackPosY) == 1) && (Math.abs(attackPosX - xClick) == 1) && (String(attackedPiece)[0] != String(attackPiece)[0] && String(attackedPiece)[0] != " "))) {
                        return true;
                    }
                }
                if (String(attackPiece)[0] == "b") {
                    if ((((attackPosY - yClick) == 1) && (xClick == attackPosX) && String(attackedPiece)[0] == " ") || (((attackPosY - yClick) == 1) && (Math.abs(attackPosX - xClick) == 1) && (String(attackedPiece)[0] != String(attackPiece)[0] && String(attackedPiece)[0] != " "))) {
                        return true;
                    }
                }
            }

            //tura//////
            if (attackPiece.match(/[a-z]t/) && String(attackPiece)[0] != String(attackedPiece)[0]) {


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
                            for (var j = attackPosX + 1; j < xClick; j++) {
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

            //rege
            if (attackPiece.match(/[a-z]m/) && String(attackPiece)[0] != String(attackedPiece)[0]) {
                if (Math.abs(attackPosX - xClick) < 2 && Math.abs(attackPosY - yClick) < 2) {
                    return true;
                }
            }

            //nebun
            if (attackPiece.match(/[a-z]n/) && String(attackPiece)[0] != String(attackedPiece)[0]) {
                console.log('pion:' + attackPosX + 'x>>' + xClick);
                console.log('pion:' + attackPosY + 'y>>' + yClick);
                //  if(Math.abs(attackPosX - xClick) == Math.abs(attackPosY - yClick)){
                //          return true;
                //      }

                if (Math.abs(attackPosX - xClick) == Math.abs(attackPosY - yClick)) {
                    var obstacleNebun = "0";
                    if (attackPosX < xClick) {
                        console.log('aX < x');
                        if (attackPosY > yClick) {
                            console.log('aY < y');
                            for (var m = attackPosX + 1; m < xClick; m++) {
                                var cooordY = (attackPosX + attackPosY) - m;
                                console.log(m + ' ' + cooordY);
                                console.log(BOARD[cooordY][m]);
                                if (BOARD[cooordY][m] != " ") {
                                    obstacleNebun = "1";
                                }
                            }
                        }
                        if (attackPosY < yClick) {
                            console.log('aY < y');
                            var o = 0;
                            for (var n = attackPosX + 1; n < xClick; n++) {
                                o++;
                                var cooordY = attackPosY + o;
                                console.log(n + ' ' + cooordY);
                                console.log(BOARD[cooordY][n]);
                                if (BOARD[cooordY][n] != " ") {
                                    obstacleNebun = "1";
                                }
                            }
                        }
                    }

                    if (attackPosX > xClick) {
                        if (attackPosY > yClick) {
                            console.log('aY < y');
                            var p = 0;
                            for (var q = xClick + 1; q < attackPosX; q++) {
                                p++;
                                var cooordY = yClick + p;
                                console.log(cooordY + ' ' + q);
                                console.log(BOARD[cooordY][q]);
                                if (BOARD[cooordY][q] != " ") {
                                    obstacleNebun = "1";
                                }
                            }
                        }
                        if (attackPosY < yClick) {
                            console.log('this');
                            for (var m = attackPosY + 1; m < yClick; m++) {
                                var cooordY = (attackPosX + attackPosY) - m;
                                console.log(m + ' ' + cooordY);
                                console.log(obstacleNebun);
                                console.log(BOARD[m][cooordY]);
                                if (BOARD[m][cooordY] != " ") {
                                    obstacleNebun = "1";
                                }
                            }
                        }
                    }


                    if (obstacleNebun == "0") {
                        return true;
                    }
                }

            }



            //regina
            if (attackPiece.match(/[a-z]f/) && String(attackPiece)[0] != String(attackedPiece)[0]) {
                
                var obstacleR = "0";
                if (Math.abs(attackPosX - xClick) == Math.abs(attackPosY - yClick)) {
                    var obstacleNebun = "0";
                    if (attackPosX < xClick) {
                        console.log('aX < x');
                        if (attackPosY > yClick) {
                            console.log('aY < y');
                            for (var m = attackPosX + 1; m < xClick; m++) {
                                var cooordY = (attackPosX + attackPosY) - m;
                                console.log(m + ' ' + cooordY);
                                console.log(BOARD[cooordY][m]);
                                if (BOARD[cooordY][m] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                        if (attackPosY < yClick) {
                            console.log('aY < y');
                            var o = 0;
                            for (var n = attackPosX + 1; n < xClick; n++) {
                                o++;
                                var cooordY = attackPosY + o;
                                console.log(n + ' ' + cooordY);
                                console.log(BOARD[cooordY][n]);
                                if (BOARD[cooordY][n] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                    }

                    if (attackPosX > xClick) {
                        if (attackPosY > yClick) {
                            console.log('aY < y');
                            var p = 0;
                            for (var q = xClick + 1; q < attackPosX; q++) {
                                p++;
                                var cooordY = yClick + p;
                                console.log(cooordY + ' ' + q);
                                console.log(BOARD[cooordY][q]);
                                if (BOARD[cooordY][q] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                        if (attackPosY < yClick) {
                            console.log('this');
                            for (var m = attackPosY + 1; m < yClick; m++) {
                                var cooordY = (attackPosX + attackPosY) - m;
                                console.log(m + ' ' + cooordY);
                                console.log(obstacleNebun);
                                console.log(BOARD[m][cooordY]);
                                if (BOARD[m][cooordY] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                    }


                    if (obstacleR == "0") {
                        return true;
                    }
                }

                if (attackPosX == xClick || attackPosY == yClick) {
                    if (attackPosX == xClick) {
                        if (attackPosY < yClick) {
                            for (var i = attackPosY + 1; i < yClick; i++) {
                                if (BOARD[i][attackPosX] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                        if (attackPosY > yClick) {
                            for (var k = yClick + 1; k < attackPosY; k++) {
                                if (BOARD[k][attackPosX] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                    }
                    if (attackPosY == yClick) {
                        if (attackPosX < xClick) {
                            for (var j = attackPosX + 1; j < xClick; j++) {
                                if (BOARD[attackPosY][j] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                        if (attackPosX > xClick) {
                            for (var l = xClick + 1; l < attackPosX; l++) {
                                if (BOARD[attackPosY][l] != " ") {
                                    obstacleR = "1";
                                }
                            }
                        }
                    }

                    if (obstacleR == "0") {
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

            moveAllowed: function (attackPiece, attackPosX, attackPosY, xClick, yClick, BOARD, attackedPiece) {
                return moveAllowed(attackPiece, attackPosX, attackPosY, xClick, yClick, BOARD, attackedPiece);
            },



        }

    }]);