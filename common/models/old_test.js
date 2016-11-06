// var jsonfile = require('jsonfile')
// var appsFile = 'server/apps.json'
// var async = require("async");
// var app = require('../../server/server.js')
// module.exports = function (Apps) {

//     Apps.SummaryResults = function (cb) {
//         var cbloop = 0;
//         var oidx = 0;
//         var newObj = [];
//         var allApps = [];
//         Apps.find(function (err, response) {
//             async.forEach(response, function (fapp, locallback) {
//                     app.models[fapp.buildInfo.name].latest(function (err, obj) {
//                     console.log("obj params " + obj.testResults.passCount)    

//                         if (!obj.buildInfo.result) {
//                             newObj.push({
//                                 "appName": obj.appname,
//                                 "id": obj.buildid
//                             })
//                         } else {
//                             console.log("build data " + obj.appname + " is "  + JSON.stringify(obj.buildInfo))
//                             newObj.push({
//                                 "appName": obj.appname,
//                                 "description": obj.buildInfo.description,
//                                 "duration": obj.buildInfo.duration,
//                                 "timestamp": obj.buildInfo.timestamp,
//                                 "createdDatetimetamp": obj.createdDatetimetamp,
//                                 "result": obj.buildInfo.result,
//                                 "id": obj.buildid,
//                                 "buildNumber": obj.buildInfo.number,
//                                 "url": obj.buildInfo.url,
//                                 "fullDisplayName": obj.buildInfo.fullDisplayName,
//                                 "failCount": obj.testResults.failCount,
//                                 "skipCount": obj.testResults.skipCount,
//                                 "totalCount": obj.testResults.skipCount + obj.testResults.failCount + obj.testResults.passCount
//                             })
//                         }
//                         if (response.length-1 === ++cbloop) {
//                             cb(null, newObj);
//                         }
// //                            locallback()

//                     })
// //                    locallback()
//                         //loop check
//                 }
// //                          ,
// //                function () {
// //                    ++cbloop
// //                    console.log(newObj)
// //                    cb(null, newObj);
// //                }
//             );
//         })


//     }

//     Apps.remoteMethod(
//         'SummaryResults', {
//             http: {
//                 path: '/SummaryResults',
//                 verb: 'get'
//             },
//             returns: {
//                 arg: 'data',
//                 type: 'object'
//             }
//         }
//     );

//     // passedTest End point
//     Apps.passedTests = function (appname, buildid, cb) {
//         var appmodel = null
//         var passedTestObj = [];
//         Apps.find(function (err, response) {
//             if (err) {
//                 cb(err, response)
//             } else if (response === null) {
//                 cb(null, response)
//             } else {
//                 async.forEach(response, function (fapp, ocallback) {
//                     if (appname == fapp.buildInfo.name) {
//                         appmodel = app.models[appname]
//                         appmodel.findOne({
//                             where: {
//                                 buildid: buildid
//                             }
//                         }, function (err, resp) {
//                             async.forEach(resp.testResults.suites[0].cases, function (testCase, icallback) {
//                                 if (testCase.status == 'PASSED')
//                                     passedTestObj.push({
//                                         "name": testCase.name,
//                                         "duration": testCase.duration
//                                     })
//                                 icallback()
//                             }, function () {
//                                 cb(null, passedTestObj)
//                             })
//                         })
//                     }
//                     ocallback()
//                 }, function () {})
//             }
//         })
//     }

//     Apps.remoteMethod(
//         'passedTests', {
//             accepts: [{
//                 arg: 'appname',
//                 type: 'string'
//             }, {
//                 arg: 'buildid',
//                 type: 'string'
//             }],
//             http: {
//                 path: '/passedTests',
//                 verb: 'get'
//             },
//             returns: {
//                 arg: 'data',
//                 type: 'object'
//             }
//         }
//     );
//     // end passedTest End Point 
//     // failedTest End point
//     Apps.failedTests = function (appname, buildid, cb) {
//         var appmodel = null
//         var failedTestObj = [];
//         Apps.find(function (err, response) {
//             if (err) {
//                 cb(err, response)
//             } else if (response === null) {
//                 cb(null, response)
//             } else {
//                 async.forEach(response, function (fapp, ocallback) {
//                         if (appname == fapp.buildInfo.name) {
//                             appmodel = app.models[appname]
//                             appmodel.findOne({
//                                 where: {
//                                     buildid: buildid
//                                 }
//                             }, function (aerr, resp) {
//                                 if (aerr || resp === null) {
//                                     cb(aerr, resp)
//                                 } else {
//                                     console.log(resp)
//                                     async.forEach(resp.testResults.suites[0].cases, function (testCase, icallback) {
//                                         if (testCase.status == 'FAILED')
//                                             failedTestObj.push({
//                                                 "name": testCase.name,
//                                                 "errorStackTrace": testCase.errorStackTrace,
//                                                 "duration": testCase.duration
//                                             })
//                                         icallback()
//                                     }, function () {
//                                         cb(null, failedTestObj)
//                                     })
//                                 }
//                             })
//                         }
//                         ocallback()
//                     },
//                     function () {
//                         console.log("finised results")
//                     })
//             }
//         })
//     }

//     Apps.remoteMethod(
//         'failedTests', {
//             accepts: [{
//                 arg: 'appname',
//                 type: 'string'
//             }, {
//                 arg: 'buildid',
//                 type: 'string'
//             }],
//             http: {
//                 path: '/failedTests',
//                 verb: 'get'
//             },
//             returns: {
//                 arg: 'data',
//                 type: 'object'
//             }
//         }
//     );
//     // end failedTests End Point
//     // allTests End point
//     Apps.allTests = function (appname, buildid, cb) {
//         var appmodel = app.models[appname]
//         var allTestObj = [];
//         appmodel.findOne({
//             where: {
//                 buildid: buildid
//             }
//         }, function (err, response) {
//             if (err) {
//                 cb(err, response)
//             } else if (response === null) {
//                 cb(null, [])
//             } else {
//                 async.forEach(response.testResults.suites[0].cases, function (testCase, icallback) {
//                     allTestObj.push({
//                         "name": testCase.name,
//                         "status": testCase.status
//                     })
//                     icallback()
//                 }, function () {
//                     cb(null, allTestObj)
//                 })
//             }

//         })

//     }

//     Apps.remoteMethod(
//         'allTests', {
//             accepts: [{
//                 arg: 'appname',
//                 type: 'string'
//             }, {
//                 arg: 'buildid',
//                 type: 'string'
//             }],
//             http: {
//                 path: '/allTests',
//                 verb: 'get'
//             },
//             returns: {
//                 arg: 'data',
//                 type: 'object'
//             }
//         }
//     );
//     // end allTests End Point
//     // apps names End point /apps/names
//     Apps.names = function (cb) {

//         allapps = []
//         Apps.find(function (err, _resp) {
//             if (!err && _resp) {
//                 async.forEach(_resp, function (_app, callback) {
//                     allapps.push(_app.testResults.name)
//                     callback()
//                 }, function () {
//                     cb(null, allapps)
//                 })
//             } else
//                 cb(err, allapps)

//         })

//     }

//     Apps.remoteMethod(
//         'names', {
//             http: {
//                 path: '/names',
//                 verb: 'get'
//             },
//             returns: {
//                 arg: 'data',
//                 type: 'object'
//             }
//         }
//     );
//     // end apps names End Point


//     // getConsildatedResults End point /apps/getConsildatedResults
//     Apps.getConsildatedResults = function (appName, startDate, endDate, cb) {
//         var appmodel = app.models[appName]
//         ConsRes = []
//         appmodel.find({
//             where: {
//                 createdDatetimetamp: {
//                     between: [startDate, endDate]
//                 }
//             }
//         }, function (err, _resp) {
//             if (!err && _resp) {
//                 async.forEach(_resp, function (_app, callback) {
//                     if (!_app.buildInfo.result) {
//                         ConsRes.push({
//                             "appName": _app.appname,
//                             "id": _app.buildid
//                         })
//                     } else {
//                         ConsRes.push({
//                             "appName": _app.appname,
//                             "description": _app.buildInfo.description,
//                             "createdDatetimetamp": _app.createdDatetimetamp,
//                             "timestamp": _app.buildInfo.timestamp,
//                             "id": _app.buildid,
//                             "buildNumber": _app.buildInfo.number,
//                             "result": _app.buildInfo.result,
//                             "jobName": _app.buildInfo.fullDisplayName,
//                             "failCount": _app.testResults.failCount,
//                             "skipCount": _app.testResults.skipCount,
//                             "totalCount": _app.testResults.passCount + _app.testResults.failCount + _app.testResults.skipCount
//                         })
//                     }
//                     //                    versions.push(_app.buildid)
//                     callback()
//                 }, function () {
//                     cb(null, ConsRes)
//                 })
//             } else
//                 cb(err, ConsRes)

//         })

//     }

//     Apps.remoteMethod(
//         'getConsildatedResults', {
//             accepts: [{
//                 arg: 'appName',
//                 type: 'string'
//             }, {
//                 arg: 'startDate',
//                 type: 'number'
//             }, {
//                 arg: 'endDate',
//                 type: 'number'
//             }],
//             http: {
//                 path: '/getConsildatedResults',
//                 verb: 'get'
//             },
//             returns: {
//                 arg: 'data',
//                 type: 'object'
//             }
//         }
//     );
//     // end apps getConsildatedResults End Point

//     // versionsHistory End point /apps/versionsHistory
//     Apps.versionsHistory = function (appName, buildID, cb) {
//         var appmodel = app.models[appName]
//         v_history = []
//         appmodel.findOne({
//             where: {
//                 buildid: buildID
//             }
//         }, function (err, _resp) {
//             if (!err && _resp) {

//                 if (_resp.hasOwnProperty('versions')) {
//                     async.forEach(Object.keys(_resp.versions.components), function (_comp, callback) {
//                         v_history.push({
//                             "name": _comp,
//                             "buildId": _resp.versions.components[_comp].buildId
//                         })
//                         callback()
//                     }, function () {
//                         cb(null, v_history)
//                     })
//                 }


//             } else
//                 cb(err, [])

//         })

//     }

//     Apps.remoteMethod(
//         'versionsHistory', {
//             accepts: [{
//                 arg: 'appName',
//                 type: 'string'
//             }, {
//                 arg: 'buildID',
//                 type: 'number'
//             }],
//             http: {
//                 path: '/versionsHistory',
//                 verb: 'get'
//             },
//             returns: {
//                 arg: 'data',
//                 type: 'object'
//             }
//         }
//     );
//     // end apps versionsHistory End Point




//     Apps.disableRemoteMethod("create", true);
//     Apps.disableRemoteMethod("upsert", true);
//     Apps.disableRemoteMethod("updateAll", true);
//     Apps.disableRemoteMethod("updateAttributes", false);

//     //    Apps.disableRemoteMethod("find", true);
//     Apps.disableRemoteMethod("findById", true);
//     Apps.disableRemoteMethod("findOne", true);
//     Apps.disableRemoteMethod("exists", true);
//     Apps.disableRemoteMethod("replace", true);
//     Apps.disableRemoteMethod("replaceById", true);
//     Apps.disableRemoteMethod("replaceOrCreate", true);

//     Apps.disableRemoteMethod("deleteById", true);
// };