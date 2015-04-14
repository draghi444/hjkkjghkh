var app = angular.module("sampleApp", ["firebase"]);

app.factory("chatMessages", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the Firebase where we will store our data
    var randomRoomId = Math.round(Math.random() * 100000000);
    var ref = new Firebase("https://docs-sandbox.firebaseio.com/af/array/full/" + randomRoomId);

    return $firebaseArray(ref);
  }
]);

app.controller("ChatCtrl", ["$scope", "chatMessages",
  function($scope, chatMessages) {
    $scope.user = "Guest " + Math.round(Math.random() * 100);

    $scope.messages = chatMessages;

    $scope.addMessage = function() {
      // $add on a synchronized array is like Array.push() except it saves to Firebase!
      $scope.messages.$add({
        from: $scope.user,
        content: $scope.message,
        timestamp: Firebase.ServerValue.TIMESTAMP
      });

      $scope.message = "";
    };

    // if the messages are empty, add something for fun!
    $scope.messages.$loaded(function() {
      if ($scope.messages.length === 0) {
        $scope.messages.$add({
          from: "Uri",
          content: "Hello!",
          timestamp: Firebase.ServerValue.TIMESTAMP
        });
      }
    });
  }
]);