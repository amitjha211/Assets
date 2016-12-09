
/// <reference path="../js/jquery-1.9.1.js" />
/// <reference path="../js/jquery-ui-1.10.3.custom.js" />
/// <reference path="../js/jsCommon.js" />
/// <reference path="angular.min.js" />
/// <reference path="my-ng-app.js" />

//require('./angular-route');
//module.exports = 'ngRoute';


var toparams = function ObjecttoParams(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + obj[key]);
    }
    return p.join('&');
};






var myApp = angular.module('myApp', ['ngSanitize']);

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


myApp.run(function ($rootScope) {
    $rootScope.hi = function () {
        alert('Hi');
    }
});




myApp.service("bll", ['$scope', '$http', function ($scope, $http) {

    this.createCRUD = function (gridName, ModuleName, primaryKey, fn) {
        ng.setGrid($http, $scope[gridName], ModuleName, "", fn);
        ng.setGrid_DML($http, $scope[gridName], ModuleName, "save", "delete", primaryKey);
    }

    this.createGrid = function (gridName, ModuleName, SubModuleName, fn) {
        ng.setGrid($http, $scope[gridName], ModuleName, SubModuleName, fn);
    }
}]);




myApp.directive("htmleditor", function () {
    return {
        restrict: "A"
        , require: "ngModel"
        , link: function (scope, elem, attrs, ngModelCtrl) {
            //Creation of HTML Control
            elem.summernote({
                onblur: function (e) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(elem.code());
                    });
                }
                , height: 300
            });

            scope.$watch(elem.attr("ng-model"), function (NewValue) {

                if (NewValue == undefined || NewValue == null)
                    elem.code("");
                else
                    elem.code(NewValue);
            });
        }
    };
});

myApp.directive("datepicker", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {

            scope.$watch(elem.attr("ng-model"), function (NewValue) {
                elem.val(NewValue);
            });

            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd/m/yy",
                onSelect: function (dateText, obj) {
                    var dt = new Date(obj.selectedYear, obj.selectedMonth, obj.selectedDay);
                    updateModel(dt.toJSON());
                },

                showOn: "button",
                buttonImage: "/images/Common/calendar.gif",
                buttonImageOnly: true
            };
            elem.datepicker(options);
        }
    };
});



myApp.directive("ajaxLoader", function () {
    return {
        restrict: "E"
        , replace: true
        , scope: {
            grd: "=grd"
        }

        , template: function () {
            var sHTML = ""
            sHTML += '<div class="row" name="divAjaxLoader" style="display: none">';
            sHTML += '  <div class="col-md-12">';
            sHTML += '      <center>';
            sHTML += '      <img src="/Assets/ajax-loader.gif" class="img" />';
            sHTML += '      </center>';
            sHTML += '  </div>';
            sHTML += '</div>';

            return sHTML;
        }

        , link: function (scope, element, attrs, mgModelCtrl) {
            //$("div[name='divAjaxLoader']",element).show();


            scope.grd.addBeforeLoad(function () {
                $(element).show();
            });

            scope.grd.addAfterLoad(function () {
                $(element).hide();
            });
        }
    };
});

myApp.directive("busy", function () {
    return {
        restrict: "E"
        , replace: true
        , scope: { grd: "=?" }
        , template: function () {
            var sHTML = "";
            sHTML += '<div  ng-show="grd.busy" class="row" name="divAjaxLoader">';
            sHTML += '  <div class="col-md-12">';
            sHTML += '      <center>';
            sHTML += '      <img src="/Assets/ajax-loader.gif" class="img" />';
            sHTML += '      </center>';
            sHTML += '  </div>';
            sHTML += '</div>';

            return sHTML;
        }
    }
});

myApp.directive("gridPanel", function () {
    return {
        restrict: "E"
        , replace: false
        , scope: {
            grd: "=grd"
        }
        , transclude: true
        , template: function () {
            var sHTML = ""
            sHTML += '<div class="row" name="divAjaxLoader" style="display: none">';
            sHTML += '  <div class="col-md-12">';
            sHTML += '      <center>';
            sHTML += '      <img src="/Assets/ajax-loader.gif" class="img" />';
            sHTML += '      </center>';
            sHTML += '  </div>';
            sHTML += '</div>';
            sHTML += '<div class="row" name="grd1" > <div ng-transclude class="col-md-12"> </div> </div>';
            sHTML += '<div class="alert alert-info" role="alert" style="display: none">No Record found !</div>'

            return sHTML;
        }

        , link: function (scope, element, attrs, mgModelCtrl) {
            //$("div[name='divAjaxLoader']",element).show();

            scope.grd.addBeforeLoad(function () {
                $("div[name='divAjaxLoader']", element).show();
                $("div[name='grd1']", element).hide();
                $("div[role='alert']", element).hide();
            });

            scope.grd.addAfterLoad(function () {
                $("div[name='divAjaxLoader']", element).hide();
                $("div[name='grd1']", element).show();

                if (scope.grd.rows.length == 0)
                    $("div[role='alert']", element).show();
                else
                    $("div[role='alert']", element).hide();
            });
        }
    };
});


myApp.directive('mccCheckboxDetectChange', [function mccCheckboxDetectChange() {
    return {
        replace: false,
        require: 'ngModel',
        scope: false,
        link: function (scope, element, attrs, ngModelCtrl) {
            element.on('change', function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(element[0].checked);
                });
            });
        }
    };
}]);


myApp.directive("myDialog", function () {
    return {
        restrict: "E",
        scope: { title: '@', dialogid: '@', onOk: '&', onCancel: '&' },
        transclude: true,
        templateUrl: "/Assets/AngularJs/HtmlUI/Dialog.html",


    };
});

myApp.directive("datetimepicker", function () {
    return {
        restrict: "E",
        templateUrl: "/Assets/AngularJs/HtmlUI/datetimepicker.html",
        link: function (scope, element, attrs, ngModelCtrl) {
            $("input[name='txtHour'] , input[name='txtMinute'] ", element).spinner();
            $("input[name='txtDate'] ", element).datepicker();

        }
    };
});


myApp.filter('shortDisplay', function () {
    return function (input) {
        if (typeof input == "string")
            return input.substring(0, 3) + "...";
        else
            return input;
    };
});

myApp.filter("dbResource", function () {
    return function (input, sTable, sField) {
        var s = "/Service/getImageFromDB?Module=" + sTable + "&Field=" + sField + "&id=" + input;
        return s;
    }
});


myApp.filter('filter1', function () {
    return function (val1, val2) {
        return val1 + val2;
    };
});


myApp.filter("sanitize", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);


function ShowMessage(sTitle, sMsg) {
    alert(sMsg);
}


var ng =
{

    getlinkPager: function (sPath, pageSize, length, start) {

        var _url = "/Service/GridData3?path=" + sPath;
        _url += "&draw=" + pageSize;
        _url += "&length=" + length;
        _url += "&start=" + start;
        return _url;
    }
    , getLink: function (sPath) {
        var _url = "/Service/GridData?path=" + sPath;
        return _url;
    }
    , UpdateLink: function (sPath) {
        return "/Service/UpdateModule?path=" + sPath;
    }

    , getlinkDownloadFile: function (sModuleName, sField, id) {
        return "/Service/downloadFile?Module=" + sModuleName + "&Field=" + sField + "&id=" + id;
    }
    , getReportlink: function (sModuleName, sOperationName) {
        return "/Service/setReport?ModuleName=" + sModuleName + "&OperationName=" + sOperationName;
    }

    , exeSQL: function getSQL($http, q, func) {
        var _url = "/Service/execSQL";

        var req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: toparams({ "SQL": q })
        };

        $http(req).success(function (data) {
            func(data);
        });
    }
    , execJson: function ($http, sPath, jnData, func) {

        var _url = ng.getLink(sPath);
        console.log(_url);
        //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        var req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: toparams(jnData)
        };
        $http(req).success(function (data) {
            func(data);
        });

    }

    , execGrid: function ($http, sPath, pageSize, start, length, jnData, func, e) {
        //alert(event.type);



        var oAjaxProcess = new clsAjaxProcessing(e);

        oAjaxProcess.start();

        var _url = ng.getlinkPager(sPath, pageSize, length, start);

        var req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: toparams(jnData)
        };
        $http(req).success(function (data) {
            func(data);
            oAjaxProcess.end();
        });
    }


    , submitForm: function ($http, fields, uploadUrl, callback) {



        var fd = new FormData();

        for (var f in fields) {
            if (fields[f] != null && fields[f] != undefined)
                fd.append(f, fields[f]);
        }

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (data) {

            if (callback != undefined) callback(data);
        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (callback != undefined) callback("Internal Server Error");
        });


    }

  , UpdateModule: function ($http, sPath, jnData, func, e) {

      var url = ng.UpdateLink(sPath);
      var oAjaxProcess = new clsAjaxProcessing(e);

      oAjaxProcess.start();

      this.submitForm($http, jnData, url, function (data) {
          var response = data['msg'];
          var data1 = data['data'];

          if (response != "") {
              ShowMessage("Opps!", response);
              if ($.isFunction(func)) func("error");
          }
          else {
              //ShowMessage("success!", response);
              if ($.isFunction(func)) func("success", data1);
          }
          oAjaxProcess.end();
      });
  }


}

