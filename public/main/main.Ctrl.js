(() => {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
    $scope.message = '';
    $scope.messages = [];

    $scope.users = [];
    $scope.mynickname = $localStorage.nickname;

    const nickname = $scope.mynickname;

    socket.emit('get-users');

    socket.on('all-users', (data) => {
      console.log(data);
      $scope.users = data.filter((item) => {
        return item.nickname !== nickname;
      });
    });

    socket.on('message-received', (data) => {
      $scope.messages.push(data);
    });

    $scope.sendMessage = (data) => {
      const newMessage = {
        message: $scope.message,
        from: $scope.mynickname
      }
      socket.emit('send-message', newMessage);
      $scope.message = '';
      // $scope.messages.push(newMessage);
    };

  };
})();
