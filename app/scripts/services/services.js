'use strict';

angular.module('chessServices', []);

angular.module('chessServices').factory('chessFunctions', ["$http", "$q",
        function ($http, $q) {

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

        return {

            draw_image: function (context, x, y, image) {
                return draw_image(context, x, y, image);
            },
            
            getBoardClickPosition: function (x, y, BOARD) {
                return getBoardClickPosition(x, y, BOARD);
            }
            
            
            
        }

    }]);