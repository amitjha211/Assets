/// <reference path="../ng-common.js" />

myApp.directive("progressBar", function () {
    return {
        restrict: "E"
        , replace: true
        , scope: { per: "=per" }
        , controller: function ($scope) {
            debugger;
            //alert("Hi");
            $scope.per1 = function () {
                return { width: $scope.per + "%", 'font-size': '10px' };
            }
        }
        , template: function () {

            /*
            var sHtml = '<div class="progress">'
            sHtml += '  <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: 2%;"> '
            sHtml += '   40 %'
            sHtml += '   </div>'
            //sHtml += '<button>Test</button>'
            sHtml += '</div>'
            */

            sHtml = '<div class="progress" style="border: 1px dotted green; padding : 2px;margin-bottom:0px;" >'
            sHtml += '  <div class="progress-bar progress-bar-success progress-bar-striped " role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" ng-style="per1()" >'
            sHtml += '     '
            sHtml += '  </div>'
            sHtml += '</div>'


            return sHtml;
        }

        , link: function (scope, element, attrs) {

        }
    }
});


myApp.directive("pager", function () {

    return {
        restrict: "E",
        replace: true,
        scope: { grd: "=grd" },
        templateUrl: "/Assets/Angularjs/htmlUI/pager.htm",
        link: function (scope, element, attrs) {
        }
    }
});

myApp.directive("sorter", function () {
    return {
        restrict: "E",
        replace: true,
        scope: { grd: "=grd", col : "@col" },
        templateUrl: "/Assets/Angularjs/htmlUI/sorter.htm",
        link: function (scope, element, attrs) {
        }
    }
});


myApp.directive('dtPicker', function ($filter) {
    return {
        restrict: 'A'
        , scope: { dtPicker : "=?" }
        , link: function (scope, element, attrs) {

            $(element).datepicker({ dateFormat: 'dd/M/yy' });

            scope.$watch("dtPicker", function (NewValue, oldValue) {

                
                if (NewValue != undefined && NewValue.indexOf("T") > 0) {
                    scope.dtPicker = $filter("date")(NewValue, "dd/MMM/yyyy");
                    element.val(scope.dtPicker);
                }

                if ($.trim(NewValue) == "")
                    element.val("");

            });

            $(element).change(function () {
                //alert(element.val());
                scope.dtPicker = element.val();
                scope.$apply();
            });
        }
    };
});
