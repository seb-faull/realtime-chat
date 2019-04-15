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

    $scope.likes = [];
    $scope.mynickname = $localStorage.nickname;

    const nickname = $scope.mynickname;

    $scope.joinPrivate = () => {
      socket.emit('join-private', {
        nickname: nickname
      });
      console.log('Private room joined!');
    };

    $scope.groupPm = () => {
      socket.emit('private-chat', {
        message: 'Hello everybody!'
      });
    };

    socket.on('show-message', (data) => {
      console.log(data);
    });

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

    socket.on('user-liked', (data) => {
      console.log(data);
      $scope.likes.push(data.from);
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

    $scope.sendLike = (user) => {
      console.log(user);
      const id = lodash.get(user, 'socketid');
      const likeObj = {
        from: nickname,
        like: id
      }
      socket.emit('send-like', likeObj);
    };

  };
})();
