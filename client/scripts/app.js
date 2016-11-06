'use strict';

var app = angular.module('testDashBoard', ['ngRoute', 'lbServices', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'nvd3', 'LocalStorageModule']);

app.run(function () {
    localStorage.clear();
});

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/mianDashboard', {
            templateUrl: 'dashboard.html',
            controller: 'MainCtrl'
        }).
        when('/totalTest/:testId/:buildId', {
            templateUrl: 'allTests.html',
            controller: 'AllTests'
        }).
        when('/totalPassed/:testId/:buildId', {
            templateUrl: 'passedTests.html',
            controller: 'PassedTests'
        }).
        when('/totalFailed/:testId/:buildId', {
            templateUrl: 'failedTests.html',
            controller: 'FailedTests'
        }).
        when('/totalSkipped/:testId/:buildId', {
            templateUrl: 'skippedTests.html',
            controller: 'skippedTest'
        }).
        when('/report', {
            templateUrl: 'report.html',
            controller: 'reportCtrl'
        }).
        when('/versions/:appName/:buildId', {
            templateUrl: 'version.html',
            controller: 'versionCtrl'
        }).
        when('/report/total-Test/:testId/:buildId', {
            templateUrl: 'all-report.html',
            controller: 'AllTestsReport'
        }).
        when('/report/total-Passed/:testId/:buildId', {
            templateUrl: 'passed-report.html',
            controller: 'PassedTestsReport'
        }).
        when('/report/total-Failed/:testId/:buildId', {
            templateUrl: 'failed-report.html',
            controller: 'FailedTestsReport'
        }).
        when('/report/total-Skipped/:testId/:buildId', {
            templateUrl: 'skipped-report.html',
            controller: 'SkippedTestsReport'
        }).
        otherwise({
            redirectTo: '/mianDashboard'
        });
  }
]);

app.constant('jenkinsConfig', {});


app.config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = ['Engaged-Auth-Token', 'Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With']
});


//main controller attached with index.html...
app.controller('MainCtrl', ['$scope', '$log', 'jenkinsConfig', '$interval', '$http', 'Apps', 'localStorageService', function ($scope, $log, jenkinsConfig, $interval, $http, Apps, localStorageService) {
    localStorage.clear();
    $scope.loading = false;
    $scope.dataError = false;
    //summary app function called for getting all apps (first time data called)...
    function loadSummary() {
        $scope.loading = true;
        $scope.dataError = false;
        Apps.SummaryResults(function (responce) {
            $scope.loading = false;
            $scope.dashBoardResults = [];
            responce.data.forEach(function (_app) {
                if (_app.fullDisplayName) {
                    _app.error = null;
                    $scope.dashBoardResults.push(_app)
                } else {
                    _app.error = _app.status;
                    $scope.dashBoardResults.push(_app)
                }
            })
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log("Error: ", error)
        });
    }

    loadSummary();

    //refresh data after every 5 minutes...
    $interval(function () {
        loadSummary();
    }, 300000)
}]); //end of mainCtrl


//controller for allTests.html
app.controller('AllTests', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    //get appname from param and data call from api of that app
    Apps.allTests({
        appname: params,
        buildid: buildId
    }, function (data) {
        $scope.loading = false;
        $scope.allTestData = data.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error);
    });

    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.allTests({
            appname: params,
            buildid: buildId
        }, function (data) {
            $scope.loading = false;
            $scope.allTestData = data.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error);
        });
    }, 300000);
}]);

//controller for allTestsReport.html
app.controller('AllTestsReport', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    //get appname from param and data call from api of that app
    Apps.allTests({
        appname: params,
        buildid: buildId
    }, function (data) {
        $scope.loading = false;
        $scope.allTestData = data.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error);
    });

    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.allTests({
            appname: params,
            buildid: buildId
        }, function (data) {
            $scope.loading = false;
            $scope.allTestData = data.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error);
        });
    }, 300000);
}]);


//controller for failedTests.html
app.controller('FailedTests', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    Apps.failedTests({
        appname: params,
        buildid: buildId
    }, function (responce) {
        $scope.loading = false;
        $scope.failData = responce.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error);
    });
    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.failedTests({
            appname: params,
        buildid: buildId
        }, function (responce) {
            $scope.loading = false;
            $scope.failData = responce.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error);
        });
    }, 300000);

}]);

//controller for sippedTests.html
app.controller('skippedTest', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    Apps.skippedTests({
        appname: params,
        buildid: buildId
    }, function (responce) {
        $scope.loading = false;
        console.log(responce)
        $scope.skippedData = responce.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error);
    });
    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.skippedTests({
            appname: params,
        buildid: buildId
        }, function (responce) {
            $scope.loading = false;
            $scope.failData = responce.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error);
        });
    }, 300000);

}]);

//controller for failedTests.html
app.controller('FailedTestsReport', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    Apps.failedTests({
        appname: params,
        buildid: buildId
    }, function (responce) {
        $scope.loading = false;
        $scope.failData = responce.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error);
    });
    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.failedTests({
            appname: params,
            buildid: buildId
        }, function (responce) {
            $scope.loading = false;
            $scope.failData = responce.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error);
        });
    }, 300000);

}]);

//controller for skippedTests.html
app.controller('SkippedTestsReport', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    Apps.skippedTests({
        appname: params,
        buildid: buildId
    }, function (responce) {
        $scope.loading = false;
        $scope.failData = responce.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error);
    });
    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.skippedTests({
            appname: params,
            buildid: buildId
        }, function (responce) {
            $scope.loading = false;
            $scope.failData = responce.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error);
        });
    }, 300000);

}]);


//controller for passedTests.html
app.controller('PassedTests', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    Apps.passedTests({
        appname: params,
        buildid: buildId
    }, function (responce) {
        $scope.loading = false;
        $scope.passedTestNames = responce.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error)
    });
    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.passedTests({
            appname: params,
        buildid: buildId
        }, function (responce) {
            $scope.loading = false;
            $scope.passedTestNames = responce.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error)
        });
    }, 300000);
}]);

//controller for passedTestsReport.html
app.controller('PassedTestsReport', ['$scope', '$routeParams', '$log', 'jenkinsConfig', '$interval', 'Apps', function ($scope, $routeParams, $log, jenkinsConfig, $interval, Apps) {
    //get url in params...
    var params = $routeParams.testId;
    var buildId = $routeParams.buildId;
    $scope.loading = true;
    $scope.dataError = false;

    Apps.passedTests({
        appname: params,
        buildid: buildId
    }, function (responce) {
        $scope.loading = false;
        $scope.passedTestNames = responce.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error)
    });
    //now after every 15 minutes http request resend...
    $interval(function () {
        Apps.passedTests({
            appname: params,
            buildid: buildId
        }, function (responce) {
            $scope.loading = false;
            $scope.passedTestNames = responce.data;
        }, function (error) {
            $scope.loading = false;
            $scope.dataError = true;
            console.log(error)
        });
    }, 300000);

}]);

//controller for reports...
app.controller('reportCtrl', ['$scope', '$log', '$timeout', 'jenkinsConfig', 'Apps', 'localStorageService', function ($scope, log, $timeout, jenkinsConfig, Apps, localStorageService) {

    var today = new Date();
    $scope.displayReport = false;
    $scope.reportData = [];
    var storedData = {};
    $scope.loading = false;
    //date format and initialization...
    $scope.format = 'dd/MM/yyyy';
    $scope.dataError = false;

    //generate button function...
    $scope.reportDataSubmit = function (appData) {
            $scope.error = false; //for displaying error bar on top of form
            $scope.dataError = false; //for display error if data not found...
            $scope.loading = true; //for display spinner...
            //if localstorage data is present then assign it to appData...
            if (storedData.appname) {
                appData = storedData;
            }

            if (appData.appname != null) {
                if (appData.start_date != null) {
                    appData.start_date = new Date(appData.start_date);
                    if (appData.end_date == null) {
                        if (appData.start_date.getTime() > today.getTime()) {
                            $scope.error = true;
                            $scope.displayReport = false;
                            $scope.loading = false; //for stop spinner...
                        }
                    } else if (appData.end_date != null) {
                        appData.end_date = new Date(appData.end_date);
                        if (appData.end_date.getTime() > today.getTime() || appData.start_date.getTime() > today.getTime() || appData.start_date.getTime() > appData.end_date.getTime()) {
                            $scope.error = true;
                            $scope.displayReport = false;
                            $scope.loading = false; //for stop spinner...
                        }
                    }
                } else if (appData.end_date != null) {
                    appData.end_date = new Date(appData.end_date);
                    if (appData.start_date != null) {
                        appData.start_date = new Date(appData.start_date);
                        if (appData.end_date.getTime() > today.getTime() || appData.end_date.getTime() < appData.start_date.getTime()) {
                            $scope.error = true;
                            $scope.displayReport = false;
                            $scope.loading = false; //for stop spinner...
                        }
                    } else if (appData.start_date == null) {
                        if (appData.end_date.getTime() > today.getTime()) {
                            $scope.error = true;
                            $scope.displayReport = false;
                            $scope.loading = false; //for stop spinner...
                        }
                    }
                }

                if (!$scope.error) {
                    if (appData.start_date == null) {
                        if (appData.end_date == null) {
                            $scope.end_date = new Date();
                            $scope.start_date = new Date();
                            $scope.start_date.setDate($scope.start_date.getDate() - 7);
                        }
                        //if only start date not put by user
                        else if (appData.end_date != null) {
                            $scope.start_date = new Date();
                            $scope.start_date.setDate($scope.end_date.getDate() - 7);
                        }
                    } else if (appData.end_date == null && appData.start_date != null) {
                        $scope.start_date = appData.start_date;
                        $scope.end_date = new Date();
                    } else {
                        $scope.start_date = appData.start_date;
                        $scope.end_date = appData.end_date;
                    }

                    if (!storedData.appname) {
                        appData.appname = appData.appname.name;
                    } else {
                        appData.appname = appData.appname;
                    }

                    appData.start_date = $scope.start_date;
                    appData.end_date = $scope.end_date;

                    //store data in local storage...
                    window.localStorage['formData'] = angular.toJson(appData);
                    //set the start date hour to 01Am and end date hour to 12Pm...

                    if (appData.end_date.getDate() == today.getDate() && appData.end_date.getMonth() == today.getMonth() && appData.end_date.getYear() == today.getYear()) {
                        appData.start_date.setHours(0);
                        appData.end_date.setHours(today.getHours());
                        appData.end_date.setSeconds(today.getSeconds() - 5);

                    } else {
                        appData.start_date.setHours(0);
                        appData.end_date.setHours(23);
                    }

                    //assign null to local storage global variable...
                    storedData = {};
                    $scope.urlPages = appData.appname;
                    Apps.getConsildatedResults({
                        appName: appData.appname,
                        startDate: appData.start_date.getTime(),
                        endDate: appData.end_date.getTime()
                    }, function (responce) {
                        $scope.loading = false;
                        $scope.reportData = responce.data;
                        if ($scope.reportData.length > 0) {
                            $scope.displayReport = true;

                            //line chart settings...
                            $scope.options = {
                                chart: {
                                    type: 'lineWithFocusChart',
                                    height: 450,
                                    margin: {
                                        top: 20,
                                        right: 20,
                                        bottom: 60,
                                        left: 40
                                    },
                                    duration: 500,
                                    useInteractiveGuideline: true,
                                    xAxis: {
                                        axisLabel: 'Build Number',
                                        tickFormat: function (d) {
                                            return d3.format(',f')(d);
                                        }
                                    },
                                    x2Axis: {
                                        tickFormat: function (d) {
                                            return d3.format(',f')(d);
                                        }
                                    },
                                    yAxis: {
                                        axisLabel: 'Tests',
                                        tickFormat: function (d) {
                                            return d3.format(',f')(d);
                                        },
                                        rotateYLabel: false
                                    },
                                    y2Axis: {
                                        tickFormat: function (d) {
                                            return d3.format(',f')(d);
                                        }
                                    }
                                },
                                title: {
                                    enable: true,
                                    text: $scope.reportData[0].appname
                                },
                            };

                            $scope.data = function generateData() {
                                var chartData = [],
                                    swapBuild, swapTotal, swapFail;

                                //push data into array and sort data in that array...
                                for (var abc = 0; abc < $scope.reportData.length; abc++) {
                                    chartData.push({
                                        "buildNumber": $scope.reportData[abc].id,
                                        //"buildNumber": $scope.reportData[abc].buildNumber,
                                        "totalCount": $scope.reportData[abc].totalCount,
                                        "failCount": $scope.reportData[abc].failCount
                                    });
                                }

                                chartData.sort(function (a, b) {
                                    return a.buildNumber - b.buildNumber;
                                });

                                var passed = [],
                                    failed = [],
                                    total = [];
                                passed.push({
                                    x: 0,
                                    y: 0
                                });
                                failed.push({
                                    x: 0,
                                    y: 0
                                });
                                total.push({
                                    x: 0,
                                    y: 0
                                });
                                for (var count = 0; count < $scope.reportData.length; count++) {
                                    passed.push({
                                        x: chartData[count].buildNumber,
                                        y: chartData[count].totalCount - chartData[count].failCount
                                    });
                                    failed.push({
                                        x: chartData[count].buildNumber,
                                        y: chartData[count].failCount
                                    });
                                    total.push({
                                        x: chartData[count].buildNumber,
                                        y: chartData[count].totalCount
                                    });
                                }

                                //Line chart data should be sent as an array of series objects.
                                return [
                                    {
                                        values: passed, //values - represents the array of {x,y} data points
                                        key: 'Passed tests', //key  - the name of the series.
                                        color: '#2ca02c' //color - optional: choose your own line color.
                },
                                    {
                                        values: failed,
                                        key: 'Failed tests',
                                        color: '#ff7f0e'
                },
                                    {
                                        values: total,
                                        key: 'Total tests',
                                        color: '#7777ff'
                }
              ];
                            }
                        } //end of $scope.reportData.length > 0...
                        else {
                            $scope.dataError = true; //for display error if data not found...
                            $scope.displayReport = false;
                        }
                    }, function (error) {
                        console.log(error);
                        $scope.dataError = true;
                        $scope.loading = false;
                    });

                    //appData.start_date = appData.end_date = null;
                    appData.appname = null;
                    appData.start_date = appData.end_date = null;
                }
            } //check appData.appname is not null...
        } //reportDataSubmit function end...


    //datepicker modals for start and end date...
    $scope.startDatePopup = {
        opened: false
    };
    $scope.endDatePopup = {
        opened: false
    };
    $scope.startDatePicker = function () {
        $scope.startDatePopup.opened = true;
    };
    $scope.endDatePicker = function () {
        $scope.endDatePopup.opened = true;
    };

    //data get from local storage...
    if (localStorage.getItem("formData")) {
        var lsData = JSON.parse(localStorage.getItem('formData'));
        storedData.start_date = lsData.start_date;
        storedData.end_date = lsData.end_date;
        storedData.appname = lsData.appname;
        $scope.reportDataSubmit(storedData);
    }
    Apps.names(function (responce) {

        $scope.appNames = [];
        for (var count = 0; count < responce.data.length; count++) {
            $scope.appNames.push({
                'id': count,
                'name': responce.data[count]
            });
        }

    }, function (error) {
        console.log(error);
    });

}]);

app.controller('versionCtrl', ['$scope', '$log', 'jenkinsConfig', '$routeParams', 'Apps', function ($scope, log, jenkinsConfig, $routeParams, Apps) {
    $scope.loading = true;
    $scope.dataError = false;
    $scope.appName = $routeParams.appName;
    $scope.buildId = $routeParams.buildId;

    Apps.versionsHistory({
        appName: $scope.appName,
        buildID: $scope.buildId
    }, function (responce) {
        $scope.loading = false;
        $scope.versions = responce.data;
    }, function (error) {
        $scope.loading = false;
        $scope.dataError = true;
        console.log(error)
    });
}]);