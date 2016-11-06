var jsonfile = require('jsonfile')
var appsFile = 'server/apps.json'
var async = require("async");
var app = require('../../server/server.js')
module.exports = function (Apps) {

    Apps.SummaryResults = function (cb) {
        var cbloop = 0;
        var oidx = 0;
        var newObj = [];
        var allApps = [];
        Apps.find(function (err, response) {
            async.forEach(response, function (fapp, locallback) {
                    app.models[fapp.buildInfo.name].latest(function (err, obj) {
                            if (obj.buildInfo === undefined) {
                                newObj.push({
                                    "appName": fapp.buildInfo.name,
                                    "status": "Resources does not exist",
                                    "id": "N/A"
                                })
                            } else if (!obj.buildInfo.result) {
                                //                                console.log("*********Not**********" + obj.appname + "*************************" + obj.buildInfo.result + "*********************")
                                newObj.push({
                                    "appName": obj.appname,
                                    "status": obj.buildInfo.status,
                                    "id": obj.buildid
                                })
                            } else {
                                newObj.push({
                                    "appName": obj.appname,
                                    "description": obj.buildInfo.description,
                                    "duration": obj.buildInfo.duration,
                                    "timestamp": obj.buildInfo.timestamp,
                                    "createdDatetimetamp": obj.createdDatetimetamp,
                                    "result": obj.buildInfo.result,
                                    "id": obj.buildid,
                                    "buildNumber": obj.buildInfo.number,
                                    "url": obj.buildInfo.url,
                                    "fullDisplayName": obj.buildInfo.fullDisplayName,
                                    "failCount": obj.testResults.failCount,
                                    "skipCount": obj.testResults.skipCount,
                                    "passCount": obj.testResults.passCount,
                                    "totalCount": obj.testResults.failCount + obj.testResults.skipCount + obj.testResults.passCount
                                })
                            }

                            if (response.length === ++cbloop) {
                                cb(null, newObj);
                            }
                            //                            locallback()

                        })
                        //                    locallback()
                        //loop check
                }
                //                          ,
                //                function () {
                //                    ++cbloop
                //                    console.log(newObj)
                //                    cb(null, newObj);
                //                }
            );
            //            console.log("**" + JSON.stringify(newObj) + "**")
        })


    }

    Apps.remoteMethod(
        'SummaryResults', {
            http: {
                path: '/SummaryResults',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );

    // passedTest End point
    Apps.passedTests = function (appname, buildid, cb) {
        var appmodel = null
        var passedTestObj = [];
        Apps.find(function (err, response) {
            if (err || response === null || response == []) {
                cb(err, response)
            } else {
                async.forEach(response, function (fapp, ocallback) {
                    if (appname == fapp.buildInfo.name) {
                        appmodel = app.models[appname]
                        appmodel.findOne({
                            where: {
                                buildid: buildid
                            }
                        }, function (err, resp) {
                            if (!err) {
                                if (fapp.nestedCases) {
                                    async.forEach(resp.testResults.suites, function (testCase, icallback) {
                                        async.forEach(testCase.cases, function (_case) {
                                             if (_case.status == 'PASSED'){
                                                   passedTestObj.push({
                                                "name": _case.name,
                                                "duration": _case.duration
                                            })
                                             }
                                          
                                        })
                                       
                                        icallback()
                                    }, function () {
                                        cb(null, passedTestObj)
                                    })
                                } else {
                                    async.forEach(resp.testResults.suites[0].cases, function (testCase, icallback) {
                                        if (testCase.status == 'PASSED')
                                            passedTestObj.push({
                                                "name": testCase.name,
                                                "duration": testCase.duration
                                            })
                                        icallback()
                                    }, function () {
                                        cb(null, passedTestObj)
                                    })
                                }
                            } else {
                                cb(err, [])
                            }


                        })
                    }
                    ocallback()
                }, function () {})
            }
        })
    }

    Apps.remoteMethod(
        'passedTests', {
            accepts: [{
                arg: 'appname',
                type: 'string'
            }, {
                arg: 'buildid',
                type: 'string'
            }],
            http: {
                path: '/passedTests',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // skipped End point
    Apps.skippedTests = function (appname, buildid, cb) {
        var appmodel = null
        var skippedTestObj = [];
        Apps.find(function (err, response) {
            if (err || response === null || response == []) {
                cb(err, response)
            } else {
                async.forEach(response, function (fapp, ocallback) {
                    if (appname == fapp.buildInfo.name) {
                        appmodel = app.models[appname]
                        appmodel.findOne({
                            where: {
                                buildid: buildid
                            }
                        }, function (err, resp) {
                            if (!err) {
                                if (fapp.nestedCases) {
                                    async.forEach(resp.testResults.suites, function (testCase, icallback) {
                                        async.forEach(testCase.cases, function (_case) {
                                            if (_case.status == 'SKIPPED') {
                                                skippedTestObj.push({
                                                    "name": _case.name,
                                                    "duration": _case.duration
                                                })
                                            }

                                        })

                                        icallback()
                                    }, function () {
                                        cb(null, skippedTestObj)
                                    })
                                } else {
                                    async.forEach(resp.testResults.suites[0].cases, function (testCase, icallback) {
                                        if (testCase.status == 'SKIPPED')
                                            skippedTestObj.push({
                                                "name": testCase.name,
                                                "duration": testCase.duration
                                            })
                                        icallback()
                                    }, function () {
                                        cb(null, skippedTestObj)
                                    })
                                }
                            } else {
                                cb(err, [])
                            }


                        })
                    }
                    ocallback()
                }, function () {})
            }
        })
    }

    Apps.remoteMethod(
        'skippedTests', {
            accepts: [{
                arg: 'appname',
                type: 'string'
            }, {
                arg: 'buildid',
                type: 'string'
            }],
            http: {
                path: '/skippedTests',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // end skippedTest End Point 
    // failedTest End point
    Apps.failedTests = function (appname, buildid, cb) {
        var appmodel = null
        var failedTestObj = [];
        Apps.find(function (err, response) {
            if (err || response === null || response == []) {
                cb(err, response)
            } else {
                async.forEach(response, function (fapp, ocallback) {
                        if (appname == fapp.buildInfo.name) {
                            appmodel = app.models[appname]
                            appmodel.findOne({
                                where: {
                                    buildid: buildid
                                }
                            }, function (aerr, resp) {
                                if (aerr || resp === null) {
                                    cb(aerr, [])
                                } else {
                                    if (fapp.nestedCases) {
                                        async.forEach(resp.testResults.suites, function (testCase, icallback) {
                                            async.forEach(testCase.cases, function (_case) {
                                                if (_case.status == 'FAILED')
                                                    failedTestObj.push({
                                                        "name": _case.name,
                                                        "errorStackTrace": _case.errorStackTrace,
                                                        "duration": _case.duration
                                                    })
                                            })

                                            icallback()
                                        }, function () {
                                            cb(null, failedTestObj)
                                        })
                                    } else {
                                        async.forEach(resp.testResults.suites[0].cases, function (testCase, icallback) {
                                            if (testCase.status == 'FAILED')
                                                failedTestObj.push({
                                                    "name": testCase.name,
                                                    "errorStackTrace": testCase.errorStackTrace,
                                                    "duration": testCase.duration
                                                })
                                            icallback()
                                        }, function () {
                                            cb(null, failedTestObj)
                                        })
                                    }
                                }
                            })
                        }
                        ocallback()
                    },
                    function () {
                        console.log("finised results")
                    })
            }
        })
    }

    Apps.remoteMethod(
        'failedTests', {
            accepts: [{
                arg: 'appname',
                type: 'string'
            }, {
                arg: 'buildid',
                type: 'string'
            }],
            http: {
                path: '/failedTests',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // end failedTests End Point
    // allTests End point
    Apps.allTests = function (appname, buildid, cb) {


        // var appmodel = app.models[appname]
        var allTestObj = [];


        var appmodel = null
            // var passedTestObj = [];
        Apps.find(function (err, response) {
            if (err || response === null || response == []) {
                cb(err, response)
            } else {
                async.forEach(response, function (fapp, ocallback) {
                    if (appname == fapp.buildInfo.name) {
                        appmodel = app.models[appname]
                        appmodel.findOne({
                            where: {
                                buildid: buildid
                            }
                        }, function (err, _resp) {
                            if (err || _resp === null) {
                                cb(err, _resp)
                            } else {
                                if (fapp.nestedCases) {
                                    async.forEach(_resp.testResults.suites, function (testCase, icallback) {
                                        async.forEach(testCase.cases, function (_case) {
                                            allTestObj.push({
                                                "name": _case.name,
                                                "status": _case.status
                                            })
                                        })

                                        icallback()
                                    }, function () {
                                        //                                        console.log("asdf ", allTestObj)
                                        cb(null, allTestObj)
                                    })
                                } else {
                                    async.forEach(_resp.testResults.suites[0].cases, function (testCase, icallback) {
                                        allTestObj.push({
                                            "name": testCase.name,
                                            "status": testCase.status
                                        })
                                        icallback()
                                    }, function () {
                                        cb(null, allTestObj)
                                    })
                                }

                            }

                        })

                    }
                })
            }
        })

    }

    Apps.remoteMethod(
        'allTests', {
            accepts: [{
                arg: 'appname',
                type: 'string'
            }, {
                arg: 'buildid',
                type: 'string'
            }],
            http: {
                path: '/allTests',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // end allTests End Point
    // apps names End point /apps/names
    Apps.names = function (cb) {

        allapps = []
        Apps.find(function (err, _resp) {
            if (!err && _resp) {
                async.forEach(_resp, function (_app, callback) {
                    allapps.push(_app.testResults.name)
                    callback()
                }, function () {
                    cb(null, allapps)
                })
            } else
                cb(err, allapps)

        })

    }

    Apps.remoteMethod(
        'names', {
            http: {
                path: '/names',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // end apps names End Point


    // getConsildatedResults End point /apps/getConsildatedResults
    Apps.getConsildatedResults = function (appName, startDate, endDate, cb) {
        var appmodel = app.models[appName]
        ConsRes = []
        appmodel.find({
            where: {
                createdDatetimetamp: {
                    between: [startDate, endDate]
                }
            }
        }, function (err, _resp) {
            if (!err && _resp) {
                async.forEach(_resp, function (_app, callback) {
                    if (!_app.buildInfo.result) {
                        //                        ConsRes.push({
                        //                            "appName": _app.appname,
                        //                            "id": _app.buildid
                        //                        })
                    } else {
                        ConsRes.push({
                            "appName": _app.appname,
                            "description": _app.buildInfo.description,
                            "createdDatetimetamp": _app.createdDatetimetamp,
                            "timestamp": _app.buildInfo.timestamp,
                            "id": _app.buildid,
                            "buildNumber": _app.buildInfo.number,
                            "result": _app.buildInfo.result,
                            "jobName": _app.buildInfo.fullDisplayName,
                            "failCount": _app.testResults.failCount,
                            "skipCount": _app.testResults.skipCount,
                            "passCount": _app.testResults.passCount,
                            "totalCount": _app.testResults.failCount + _app.testResults.skipCount + _app.testResults.passCount
                        })
                    }
                    //                    versions.push(_app.buildid)
                    callback()
                }, function () {
                    cb(null, ConsRes)
                })
            } else
                cb(err, ConsRes)

        })

    }

    Apps.remoteMethod(
        'getConsildatedResults', {
            accepts: [{
                arg: 'appName',
                type: 'string'
            }, {
                arg: 'startDate',
                type: 'number'
            }, {
                arg: 'endDate',
                type: 'number'
            }],
            http: {
                path: '/getConsildatedResults',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // end apps getConsildatedResults End Point

    // versionsHistory End point /apps/versionsHistory
    Apps.versionsHistory = function (appName, buildID, cb) {
        var appmodel = app.models[appName]
        v_history = []
        appmodel.findOne({
            where: {
                buildid: buildID
            }
        }, function (err, _resp) {
            if (!err && _resp) {

                if (_resp.hasOwnProperty('versions')) {
                    async.forEach(Object.keys(_resp.versions.components), function (_comp, callback) {
                        v_history.push({
                            "name": _comp,
                            "buildId": _resp.versions.components[_comp].buildId
                        })
                        callback()
                    }, function () {
                        cb(null, v_history)
                    })
                }


            } else
                cb(err, [])

        })

    }

    Apps.remoteMethod(
        'versionsHistory', {
            accepts: [{
                arg: 'appName',
                type: 'string'
            }, {
                arg: 'buildID',
                type: 'number'
            }],
            http: {
                path: '/versionsHistory',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // end apps versionsHistory End Point




    Apps.disableRemoteMethod("create", true);
    Apps.disableRemoteMethod("upsert", true);
    Apps.disableRemoteMethod("updateAll", true);
    Apps.disableRemoteMethod("updateAttributes", false);

    //    Apps.disableRemoteMethod("find", true);
    Apps.disableRemoteMethod("findById", true);
    Apps.disableRemoteMethod("findOne", true);
    Apps.disableRemoteMethod("exists", true);
    Apps.disableRemoteMethod("replace", true);
    Apps.disableRemoteMethod("replaceById", true);
    Apps.disableRemoteMethod("replaceOrCreate", true);

    Apps.disableRemoteMethod("deleteById", true);
};