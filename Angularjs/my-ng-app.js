
/// <reference path="../js/jquery-1.9.1.js" />
/// <reference path="../js/jquery-ui-1.10.3.custom.js" />
/// <reference path="../js/jsCommon.js" />
/// <reference path="angular.min.js" />
/// <reference path="my-ng-app.js" />

//require('./angular-route');
//module.exports = 'ngRoute';


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
            sHTML += '      <img src="/Content/ajax-loader.gif" class="img" />';
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
            sHTML += '      <img src="/Content/ajax-loader.gif" class="img" />';
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
            sHTML += '      <img src="/Content/ajax-loader.gif" class="img" />';
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
        templateUrl: "/Content/AngularJs/HtmlUI/Dialog.html",


    };
});

myApp.directive("datetimepicker", function () {
    return {
        restrict: "E",
        templateUrl: "/Content/AngularJs/HtmlUI/datetimepicker.html",
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

    getlinkPager: function (ModuleName, SubModuleName, pageSize, length, start) {

        var _url = "/Service/GridData3?ModuleName=" + ModuleName + "&SubModuleName=" + SubModuleName;
        _url += "&draw=" + pageSize;
        _url += "&length=" + length;
        _url += "&start=" + start;
        return _url;
    }
    , getLink: function (ModuleName, SubModuleName) {
        var _url = "/Service/GridData?ModuleName=" + ModuleName + "&SubModuleName=" + SubModuleName;
        return _url;
    }

    , UpdateLink: function (sModuleName, sOperationName) {
        return "/Service/UpdateModule?ModuleName=" + sModuleName + "&OperationName=" + sOperationName;
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
    , execJson: function ($http, ModuleName, SubModuleName, jnData, func) {

        var _url = ng.getLink(ModuleName, SubModuleName);
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

    , execGrid: function ($http, ModuleName, SubModuleName, pageSize, start, length, jnData, func, e) {
        //alert(event.type);



        var oAjaxProcess = new clsAjaxProcessing(e);

        oAjaxProcess.start();

        var _url = ng.getlinkPager(ModuleName, SubModuleName, pageSize, length, start);

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

    , setGrid_DML: function ($http, grid, ModuleName, ActionName, deleteActionName, PrimaryKeyField) {


        grid.ModuleName = ModuleName;
        grid.PrimaryKeyField = PrimaryKeyField == undefined ? ModuleName + "ID" : PrimaryKeyField;



        grid.row_copy = null;


        grid.formClear = function () {
            grid.row = {};
            grid.row[grid.PrimaryKeyField] = 0;
        }


        grid.downloadFile = function (r, sField) {

            var iID = 0;
            iID = r[grid.PrimaryKeyField];
            var sPath = ng.getlinkDownloadFile(grid.ModuleName, sField, iID);

            document.location.href = sPath;

        }

        grid.exec = function (sAction, e, callback) {

            if (grid.beforeSave != undefined) {
                if (!grid.beforeSave()) return false;
            }

            ng.UpdateModule($http, ModuleName, sAction, grid.row, function (status, data) {
                if (status == "success") {

                    grid.formClear();

                    if (grid.afterSave != undefined && $.isFunction(grid.afterSave)) {
                        grid.afterSave(data);
                    }

                    if ($.isFunction(callback)) callback();




                }
            }, e);
        }

        grid.save = function (callback, e) {

            /*
            if (grid.beforeSave != undefined) {
                if (!grid.beforeSave()) return false;
            }

            ng.UpdateModule($http, ModuleName, ActionName, grid.row, function (status, data) {
                if (status == "success") {



                    grid.formClear();

                    if (grid.afterSave != undefined && $.isFunction(grid.afterSave)) {
                        grid.afterSave(data);
                    }

                    if ($.isFunction(callback)) callback();




                }
            }, e);
            */
            grid.exec(ActionName, e, callback);
        }


        grid.edit = function (r) {
            grid.row = r;
        }


        grid.copy = function (r) {
            grid.row_copy = r == undefined ? clone(grid.row) : clone(r);
        }

        grid.paste = function () {
            grid.row = clone(grid.row_copy);
            grid.row.id = 0;
        }

        grid.del = function (r, callBack, e) {
            if (!confirm("Are you sure want to delete selected record ?")) return;

            ng.UpdateModule($http, ModuleName, deleteActionName, { id: r[grid.PrimaryKeyField] }, function (status) {

                if (status == "success") {

                    //if (callBack != undefined) grid.load();
                    grid.formClear();

                    if ($.isFunction(callBack)) {
                        callBack();
                    }
                    else if (callBack == undefined) {
                        grid.load();
                    }
                }
            }, e);
        }
    }
    , setGrid: function ($http, grid, ModuleName, subModuleName, fnPostJson) {
        grid.row = {};

        this.loadAll = function () {
            grid.loadAll();
        }


        grid.rows = [];
        grid.count = 0;
        grid.pageIndex = 0;
        grid.pageSize = 10;
        grid.pageButtons = [0, 1, 2, 3];


        grid.getSortClass = function (sField) {

            if (sField == grid.sort_field) {
                switch (grid.sort_type) {
                    case "asc":
                        return "fa-sort-asc";
                    case "desc":
                        return "fa-sort-desc";
                    default:
                        return "fa-sort"
                }
            }
            else {
                return "fa-sort"
            }
        }


        //Sorting setting 
        grid.sort_type = ""
        grid.sort_field = ""

        grid.sort = function (sField, e) {
            grid.sort_field = sField;
            grid.sort_type = grid.sort_type == "asc" ? "desc" : "asc";
            grid.load(null, e);
        }
        /////////////////







        grid.getPageCount = function () {
            return Math.ceil(grid.count / grid.pageSize);
        }


        grid.changePage = function (iPageIndex) {

            grid.pageIndex = iPageIndex;
            grid.load();

        }

        grid.MoveToFirstPage = function () {
            grid.pageButtons[0] = 0
            grid.pageButtons[1] = 1
            grid.pageButtons[2] = 2
            grid.pageButtons[3] = 3


            grid.pageIndex = grid.pageButtons[0];
            grid.load();


        }

        grid.MoveToLastPage = function () {

            while (grid.pageButtons[3] <= grid.getPageCount() - 1) {
                grid.pageButtons[0] += 4
                grid.pageButtons[1] += 4
                grid.pageButtons[2] += 4
                grid.pageButtons[3] += 4
            }

            grid.pageIndex = grid.pageButtons[0];
            grid.load();
        }




        grid.MoveNext = function () {

            if (grid.pageButtons[3] >= grid.getPageCount()) {
                //alert(grid.pageButtons[3] + ": " + grid.getPageCount());
                return;
            }




            grid.pageButtons[0] += 4
            grid.pageButtons[1] += 4
            grid.pageButtons[2] += 4
            grid.pageButtons[3] += 4


            grid.pageIndex = grid.pageButtons[0];
            grid.load();

        }




        grid.MovePrevious = function () {
            if (grid.pageButtons[0] <= 0) return;

            grid.pageButtons[0] -= 4
            grid.pageButtons[1] -= 4
            grid.pageButtons[2] -= 4
            grid.pageButtons[3] -= 4


            grid.pageIndex = grid.pageButtons[0];
            grid.load();
        }

        grid.setButtons = function () {


        }

        grid.load = function (callBack, e) {




            var jnPost = {};


            if (grid.sort_type != "" && grid.sort_field != "") {
                jnPost["$sort"] = grid.sort_field + " " + grid.sort_type;
            }


            if (fnPostJson != undefined) fnPostJson(jnPost);



            ng.execGrid($http, ModuleName, subModuleName, grid.pageIndex, grid.pageIndex * grid.pageSize, grid.pageSize, jnPost, function (data) {
                grid.rows = data.data;
                grid.count = data.recordsTotal;
                if ($.isFunction(callBack)) callBack();
                //grid.setButtons();
            }, e);
        }


        grid.loadAll = function (dPostData, callBack, e) {


            var jnPost = null;


            if ($.isPlainObject(dPostData))
                jnPost = dPostData;
            else
                if ($.isFunction(fnPostJson)) {
                    var jnPost = {};
                    fnPostJson(jnPost);
                }

            ng.execJson($http, ModuleName, subModuleName, jnPost, function (data) {
                if (angular.isArray(data)) {
                    grid.rows = data;
                    grid.count = data.length;
                    if ($.isFunction(callBack)) callBack();
                }
            }, e);
        }

        grid.selectById = function (iId, callback, e) {

            var jnPost = {};
            jnPost[grid.PrimaryKeyField] = iId;


            ng.execJson($http, ModuleName, subModuleName, jnPost, function (data) {
                if (data.length > 0) {
                    grid.row = data[0];
                    if ($.isFunction(callback)) callback();
                }
            }, e);
        }


        grid.getSelectedValues = function (sField) {
            var ids = [];
            for (var i = 0; i < grid.rows.length; i++) {
                var r = grid.rows[i];

                if (r.chk1)
                    ids.push(r[sField]);
            }
            return ids.join(",")

        };

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

 , UpdateModule: function ($http, sModuleName, sOperationName, jnData, func, e) {

     var url = ng.UpdateLink(sModuleName, sOperationName);
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
 , setReport: function ($http, sModuleName, sOperationName, jnData, func, e) {
     debugger;
     var url = ng.getReportlink(sModuleName, sOperationName);
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

var toparams = function ObjecttoParams(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + obj[key]);
    }
    return p.join('&');
};

function ngCRUD($http) {
}
