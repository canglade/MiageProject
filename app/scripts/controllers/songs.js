'use strict';
/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('SongsCtrl', function ($rootScope, $scope,$route, serviceDb, $sce) {
    $rootScope.activeHome = "";
    $rootScope.activeSongs = "active";
    $rootScope.activeAccount = "";
    $rootScope.activeContacts = "";
    $rootScope.activeAbout = "";
    $rootScope.activeConnection = "";
    $scope.currentPage = 1;
    $scope.totalPages = 0;
    $scope.loading = true;
    //$scope.orderByArtist = "artist";
    $scope.loadSong = function () {
//------------------------------------------------------
      $scope.loading = true;
      serviceDb.randSong().success(function (data) {
        $scope.loading = false;
        $scope.song = data;
      });
    };
    /*$scope.pageChanged = function(){
     $scope.loadSong();
     };*/
    $scope.loadSong();
    $scope.like = function(){
      var song = $scope.song.track_id;
      var mail = $scope.userMail;
      /*var data = "{\"track_id\": \"" + song + "\" } ";*/
      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";
      serviceDb.addLike(data).success(function(data){
        /*$route.reload();
         $scope.loadSong();*/
      });
      $scope.loadSong();
    };
    $scope.dislike = function(){
      var song = $scope.song.track_id;
      var mail = $scope.userMail;
      /*var data = "{\"track_id\": \"" + song + "\" } ";*/
      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";
      serviceDb.addDislike(data).success(function(data){
        /*$route.reload();
         $scope.loadSong();*/
      });
      $scope.loadSong();
    };
    $scope.AuthentificatedRedirection();
    $scope.lecteur= function (artist, song) {
      //var artiste = artist.replace(/ /g, "+");
      //var chanson = song.replace(/ /g, "+");
      //console.log("artist " + artiste);
      //console.log("son " + chanson);
      var url = "https://api.spotify.com/v1/search?q=artist:Lady+Gaga+title:Bad+Romance&type=track&limit=1";
      //var url = "https://api.spotify.com/v1/search?q=artist:" + artiste +  "+title:" + chanson + "&type=track&limit=1";
      console.log("url " + url)
      $.getJSON(url).then(function(data) {
        $scope.previewUrl = $sce.trustAsResourceUrl(data.tracks.items[0].preview_url)
        //$scope.nomlArtiste =
        //console.log(data.tracks.items[0].preview_url);
      })
      /*$.getJSON('https://api.spotify.com/v1/search?q=artist:Lady+Gaga+title:Bad+Romance&type=track&limit=1').then(function(data) {
       console.log(data.tracks.items[0].preview_url); //you can comment this, i used it to debug
       $scope.result = $sce.trustAsResourceUrl(data.tracks.items[0].preview_url);
       })*/
    }
  });
