/**
 * Created by dima on 7/11/14.
 */
var ModalInstanceCtrl = function ($scope, $modalInstance, user, $sce) {
    $scope.user = user;

    /**
     * add winner name
     * @param name
     */
    $scope.addName = function(name){
        var winArr =getWinners();
        winArr.push({name:$sce.trustAsHtml(name).toString(), time:user.timer, steps: user.steps});
        $scope.winners = winArr;
        localStorage.setItem('winners' , JSON.stringify(winArr));
        $scope.user.winner = false;
    }

    function getWinners()
    {
        var winArr = JSON.parse(localStorage.getItem("winners"));
        return (winArr == null) ? [] : winArr;
    }

    $scope.winners = getWinners();
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};