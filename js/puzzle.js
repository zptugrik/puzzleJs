/**
 * Created by dima on 7/9/14.
 */
'use strict';

var puzzleApp = angular.module('puzzleApp', ['ui.bootstrap']);
    puzzleApp.controller('puzzleCtrl', function ($scope, $timeout, $modal) {


    var values = makeTilesVal(rows, cols);
    var timer, invI, invJ;
    $scope.started = false;
    $scope.invisibleTile = rows*cols;
    $scope.user = {steps : 0};

    /**
     *
     * @param rows
     * @param cols
     * @returns {Array}
     */
    function makeTilesVal(rows, cols){
        var values = [];
        for(var i=0; i<rows*cols; i++)
            values[i] = i+1;
        return values;
    }

    /**
     * inititalization filed on start
     * @param rows {int}
     * @param cols {int}
     */
     function initField(rows, cols, val){
         var tiles = [], cur = 0;
         for(var i=0; i<rows; i++)
         {
            if(typeof(tiles[i]) == 'undefined') tiles[i] = [];
            for(var j=0; j<cols; j++)
            {
                tiles[i][j] = val[cur];
                if(val[cur] == $scope.invisibleTile)
                {
                    invI = i;
                    invJ = j;
                }
                cur++;
            }
         }
         $scope.tiles = tiles;
     }

    /**
     *
     * @param a {array of int}
     * @returns {*}
     */
    function shuffle() {
        /*var q;
        for (var j, x, i = a.length; i; j = parseInt(Math.random() * i, 10), x = a[--i], a[i] = a[j], a[j] = x) { q = 0; }
        return a;*/
        var neiborTiles = [];
        if(typeof $scope.tiles[invI][invJ-1]!='undefined') neiborTiles.push($scope.tiles[invI][invJ-1]);
        if(typeof $scope.tiles[invI][invJ+1]!='undefined') neiborTiles.push($scope.tiles[invI][invJ+1]);
        if(typeof $scope.tiles[invI+1]!='undefined') neiborTiles.push($scope.tiles[invI+1][invJ]);
        if(typeof $scope.tiles[invI-1]!='undefined') neiborTiles.push($scope.tiles[invI-1][invJ]);
        var randTile = neiborTiles[Math.floor(Math.random() * neiborTiles.length)];
        $scope.move(randTile, false);
    }

    /**
     * handler for click on Start button
     */
    $scope.start = function()
    {
        $scope.started = true;

        initField(rows, cols, values);
        for(var i=0; i<300; i++)
            shuffle();
        startTime();
    }

    /**
     * handler for click on Stop button
     */
    $scope.stop = function()
    {
        $scope.started = false;
        $timeout.cancel(timer);
        $scope.user = {timer : '0:00:00', steps : 0, winner : false};
        initField(rows, cols, values);

    }

    /**
     *
     * @param value {int}
     * @param checkWin {bool}
     */
    $scope.move = function (value, checkWin){
        checkWin = typeof checkWin != 'undefined' ? checkWin : true;
        if(checkWin && !$scope.started) return;
        for(i=0; i<rows; i++){
            var j = $scope.tiles[i].indexOf(value);
            if(j!= -1){ //find curr tile
                if((invI == i && (invJ == j+1 || invJ == j-1)) || (invJ == j && (invI == i+1 || invI == i-1)))
                {
                    $scope.tiles[i][j] = $scope.invisibleTile;
                    $scope.tiles[invI][invJ] = value;
                    invI = i;
                    invJ = j;
                }
                if(!checkWin)return;
                else $scope.user.steps++;

                // check maybe this is a winner move
                var iter = 1;
                for(var i=0; i<rows; i++)
                    for(var j=0;j<cols; j++)
                    {
                        if($scope.tiles[i][j] != iter)
                            return;
                        else
                            iter++;
                    }
                if(iter-1 ==  $scope.invisibleTile) // it means winner
                {
                    $timeout.cancel(timer);
                    $scope.user.winner = true;
                    // show modal winners table
                    modalInstance();
                }

                return;
            }
        }
    }

    /**
     * Shows history table
     */
    $scope.history = function(){
        modalInstance();
    }

    /**
     *  Shows modal window
     */
    function modalInstance(){

        $modal.open({
            templateUrl: 'myModalContent.html',
            windowClass : 'modWin',
            controller: ModalInstanceCtrl,
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });
        $scope.stop();
    }

    /**
     * starttime function
     * @param time
     */
    function startTime(time) {
        var tick = 500;
        time = typeof time != 'undefined' ? time+tick : 0;
        var h = parseInt((time/1000)/60/60);
        var m = checkTime(parseInt((time/1000)/60));
        var s = checkTime(parseInt((time/1000)%60));
        $scope.user.timer = h+":"+m+":"+s;
        timer = $timeout(function(){startTime(time)},tick);
    }

    /**
     * time function
     * @param i
     * @returns {*}
     */
    function checkTime(i) {
        if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    initField(rows, cols, values);
});

