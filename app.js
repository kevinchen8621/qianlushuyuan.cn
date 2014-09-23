'use strict';

angular.module("app",[
  "ngResource",
  "ngAnimate",
  "ui.router",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.buffering",
  "com.2fdevs.videogular.plugins.poster"
])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state("signin", {url:'/signin', templateUrl: '/tpl/signin.html'})
    .state("signup", {url:'/signup', templateUrl: '/tpl/signup.html'})
    .state("video", {url:'/video/:id', templateUrl: '/tpl/video.html',controller:'VideoCtrl'})
    .state("home", {url:'/', templateUrl: '/tpl/home.html',controller:'HomeCtrl'})
}])
.factory('api', function ($rootScope, $http, $window) {
  var apiBase = 'api' /* base /api uri */,
      token = ($window.sessionStorage.token || $window.localStorage.token || ''),
      headers = {Authorization: 'Bearer ' + token},
      wsHost = ($window.document.location.origin || ($window.location.protocol + '//' + $window.location.host)).replace(/^http/, 'ws'),
      api = {events: {}};
    
    // initiate the websocket connection to the host
    var ws = api.ws = new WebSocket(wsHost + '?access_token=' + token);
  $window.setInterval(function () {ws.send('ping');}, 1000 * 25); // keep-alive signal (needed for heroku)

  // utilize jQuery's callbacks as an event system
  function event() {
    var callbacks = $.Callbacks();
    return {
      subscribe: function ($scope, fn) {
            if (fn) {// unsubscribe from event on controller destruction to prevent memory leaks
                $scope.$on('$destroy', function () {callbacks.remove(fn);});
        } else {
                fn = $scope;
            }
            callbacks.add(fn);
        },
        unsubscribe: callbacks.remove,
        publish: callbacks.fire
    };
  }
  
  // websocket connected disconnected events
  api.connected = event();
  ws.onopen = function () {
    api.connected.publish.apply(this, arguments);
    $rootScope.$apply();
  };

  api.disconnected = event();
  ws.onclose = function () {
    api.disconnected.publish.apply(this, arguments);
    $rootScope.$apply();
  };


  // websocket data event (which transmits json-rpc payloads)
  function index(obj, i) {return obj[i];} // convert dot notation string into an actual object index
  ws.onmessage = function (event /* websocket event object */) {
    var data = JSON.parse(event.data /* rpc event object (data) */);
    if (!data.method) {
      throw 'Malformed event data received through WebSocket. Received event data object was: ' + data;
    } else if (!data.method.split('.').reduce(index, api)) {
      throw 'Undefined event type received through WebSocket. Received event data object was: ' + data;
    }
    data.method.split('.').reduce(index, api).publish(data.params);
    $rootScope.$apply();
  };
  return api;
})
.run(['$rootScope', '$location', '$window', 'api', '$resource', function ($rootScope, $location, $window, api, $resource) {
  //$resource('/api/dirvideo/' + )
  $rootScope.allVideos = [ ];
  api.videos.list().success(function(doc){
    for(var x in doc.videos){
      $rootScope.allVideos.push({filename:doc.videos[x], face:'/img/'+x+'.jpg'});
    }
    $rootScope.videosetting = doc.setting;
    console.log($rootScope);
  });

}])

;
