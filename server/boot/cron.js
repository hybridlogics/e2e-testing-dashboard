var CronJob = require('cron').CronJob;
var request = require('request');
var jsonfile = require('jsonfile')

var btoa = require('btoa')
var errorFile = 'server/error.json'

var async = require("async");
var appsFile = 'server/apps.json'



module.exports = function (app) {
    var apps = app.models.apps

    //***************JSON OBJECT DEFINED BELOW 
    var errors = [
        {
            "err_name": 404,
            "status": "sts failed to run"
  },
        {
            "err_name": 503,
            "status": "The service is currently unavailable"
  },
        {
            "err_name": 500,
            "status": "An internal error"
  },
        {
            "err_name": 401,
            "status": "Anonymous clients are not authorized to view the content"
  }
]
    var appcalls = [
        {
            "model": {
                "model": app.models.ios
            },
            "nestedCases": true,
			 "credentials": {
                "username": "foo",
                "password": "bar"
            },
            "testResults": {
                "name": "ios",
                "desc": "application 1",
                "type": "testResults",
                "url": "https://dashboardmocks.herokuapp.com/testResults/app2"
            },
            "buildInfo": {
                "name": "ios",
                "desc": "application 1",
                "type": "buildInfo",
                "url": "https://dashboardmocks.herokuapp.com/buildInfo/app2"
            },
            "versions": "https://dashboardmocks.herokuapp.com/versions"
             },
        {
            "model": {
                "model": app.models.android
            },
            
            "nestedCases": true,
			 "credentials": {
                "username": "foo",
                "password": "bar"
            },
            "testResults": {
                "name": "android",
                "desc": "application 2",
                "type": "testResults",
                "url": "https://dashboardmocks.herokuapp.com/testResults/app1"
            },
            "buildInfo": {
                "name": "android",
                "desc": "application 2",
                "type": "buildInfo",
                "url": "https://dashboardmocks.herokuapp.com/buildInfo/app1"
            },
            "versions": "https://dashboardmocks.herokuapp.com/versions"
            },
        {
            "model": {
                "model": app.models.web
            },
            
            "nestedCases": true,
            "credentials": {
                "username": "foo",
                "password": "bar"
            },
            "testResults": {
                "name": "web",
                "desc": "application 3",
                "type": "testResults",
                "url": "https://dashboardmocks.herokuapp.com/testResults/app1"
            },
            "buildInfo": {
                "name": "web",
                "desc": "application 3",
                "type": "buildInfo",
                "url": "https://dashboardmocks.herokuapp.com/buildInfo/app1"
            },
            "versions": "https://dashboardmocks.herokuapp.com/versions"
            },
        {
            "model": {
                "model": app.models.pcms
            },
            
            "nestedCases": true,
			 "credentials": {
                "username": "foo",
                "password": "bar"
            },
            "testResults": {
                "name": "pcms",
                "desc": "application 4",
                "type": "testResults",
                "url": "https://dashboardmocks.herokuapp.com/testResults/app1"
            },
            "buildInfo": {
                "name": "pcms",
                "desc": "application 4",
                "type": "buildInfo",
                "url": "https://dashboardmocks.herokuapp.com/buildInfo/app1"
            },
            "versions": "https://dashboardmocks.herokuapp.com/versions"
             },
        {
            "model": {
                "model": app.models.crm
            },
            
            "nestedCases": true,
			 "credentials": {
                "username": "foo",
                "password": "bar"
            },
            "testResults": {
                "name": "crm",
                "desc": "application 5",
                "type": "testResults",
                "url": "https://dashboardmocks.herokuapp.com/testResults/app1"
            },
            "buildInfo": {
                "name": "crm",
                "desc": "application 5",
                "type": "buildInfo",
                "url": "https://dashboardmocks.herokuapp.com/buildInfo/app1"
            },
            "versions": "https://dashboardmocks.herokuapp.com/versions"
            },
        {
            "model": {
                "model": app.models.roku
            },
            "credentials": {
                "username": "foo",
                "password": "bar"
            },
            
            "nestedCases": true,
            "testResults": {
                "name": "roku",
                "desc": "application 6",
                "type": "testResults",
                "url": "https://dashboardmocks.herokuapp.com/testResults/app1"
            },
            "buildInfo": {
                "name": "roku",
                "desc": "application 6",
                "type": "buildInfo",
                "url": "https://dashboardmocks.herokuapp.com/buildInfo/app1"
            },
            "versions": "https://dashboardmocks.herokuapp.com/versions"
            }
        ]

    appcalls.forEach(function (fapp, i) {
            apps.create(fapp, function (err, resp) {
                if (!err)
                    console.log(++i + " app(s) loaded")
            })
        })
        //    *************** END JSON CONFIGURATION
        // this is the cron job wich will execute after every 15 minutes
    var datamigration = function () {
        console.log('data is being updateing if any change found!');

        appcalls.forEach(function (appcall) {


            if (appcall.hasOwnProperty('credentials')) {
                var BIoptions = {
                    method: 'GET',
                    url: appcall.buildInfo.url,
                    rejectUnauthorized: false,
                    headers: {
                        authorization: "Basic " + btoa(appcall.credentials.username + ":" + appcall.credentials.password)
                    }
                }
                var TRoptions = {
                    method: 'GET',
                    url: appcall.testResults.url,
                    rejectUnauthorized: false,
                    headers: {
                        authorization: "Basic " + btoa(appcall.credentials.username + ":" + appcall.credentials.password)
                    }
                }
                var Voptions = {
                    method: 'GET',
                    url: appcall.versions,
					 headers: {
                        authorization: "Basic " + btoa(appcall.credentials.username + ":" + appcall.credentials.password)
                    }
                }
            } else {

                var BIoptions = {
                    method: 'GET',
                    url: appcall.buildInfo.url,
                    rejectUnauthorized: false
                }
                var TRoptions = {
                    method: 'GET',
                    url: appcall.testResults.url,
                    rejectUnauthorized: false
                }
                var Voptions = {
                    method: 'GET',
                    url: appcall.versions
                }
            }
            //              start request

            request(BIoptions, function (b_error, BIresponse, BIbody) {
                    //                    console.log("BI Options" + JSON.stringify(BIoptions))
                    //                    console.log("BI Options" + JSON.stringify(BIresponse))
                    request(Voptions, function (error, v_response, Vbody) {
                            if (BIresponse === undefined) {
                                console.log("failed updating data")
                            } else if (!b_error && !error && BIresponse.statusCode == 200) {
								    var jsonbody = JSON.parse(BIbody);
                                var versionBody = JSON.parse(Vbody);
								var keyz = Object.keys(versionBody.components);
								
								for(var key in keyz) {
									delete versionBody.components[keyz[key]].nodes
								}
                            
                                request(TRoptions, function (tr_error, TRresponse, body) {
                                    if (!tr_error && TRresponse.statusCode == 200) {
                                        var jsontestResults = JSON.parse(body)
                                        appcall.model.model.find(function (err, resp) {
                                            console.log("resp.length: ", resp.length)
                                            if (resp.length == 0) {
                                                appcall.model.model.replaceOrCreate({
                                                    "appname": appcall.buildInfo.name,
                                                    "buildid": jsonbody.id,
                                                    "description": "",
                                                    "createdDatetimetamp": new Date().getTime(),
                                                    "timestamp": jsonbody.timestamp,
                                                    "url": jsonbody.url,
                                                    "buildInfo": jsonbody,
                                                    "testResults": jsontestResults,
                                                    "versions": versionBody
                                                }, function (err, resp) {
                                                    if (err)
                                                        console.log("Eror: ", err)
                                                    else
                                                        console.log("Data Saved!")
                                                })
                                            } else
                                                resp.forEach(function (obj, idx) {
                                                    if (obj.buildid === jsonbody.id)
                                                        var idExist = true
                                                            // searching existing build id
                                                    if (resp.length == ++idx) {
                                                        if (!idExist) {
                                                            appcall.model.model.replaceOrCreate({
                                                                "appname": appcall.buildInfo.name,
                                                                "buildid": jsonbody.id,
                                                                "description": "",
                                                                "createdDatetimetamp": new Date().getTime(),
                                                                "timestamp": jsonbody.timestamp,
                                                                "url": jsonbody.url,
                                                                "buildInfo": jsonbody,
                                                                "testResults": jsontestResults,
                                                                "versions": versionBody
                                                            }, function (err, resp) {
                                                                if (err)
                                                                    console.log("Err: ", err)
                                                                else
                                                                    console.log("Data Saved!")
                                                            })
                                                        } else {

                                                            console.log("data already exist")
                                                        }
                                                    }
                                                })
                                        })

                                    }

                                })
                            } else {
                                errors.forEach(function (httperr) {
                                    if (httperr.err_name == BIresponse.statusCode) {
                                        appcall.model.model.find(function (err, resp) {
                                            console.log("resp.length: ", resp.length)
                                            if (resp.length == 0) {
                                                appcall.model.model.replaceOrCreate({
                                                    "appname": appcall.buildInfo.name,
                                                    "buildid": "-1",
                                                    "error": "HTTP-ERR" + BIresponse.statusCode,
                                                    "createdDatetimetamp": new Date().getTime(),
                                                    "buildInfo": httperr,
                                                    "testResults": httperr
                                                }, function (err, resp) {
                                                    if (err)
                                                        console.log("Err: ", err)
                                                    else
                                                        console.log("First Data Saved!")
                                                })
                                            } else {
                                                resp.forEach(function (rec, idx) {
                                                    if (rec.buildid == "-1" && rec.error == "HTTP-ERR" + BIresponse.statusCode)
                                                        var errExist = true
                                                    if (resp.length == ++idx) {
                                                        if (!errExist) {
                                                            appcall.model.model.replaceOrCreate({
                                                                "appname": appcall.buildInfo.name,
                                                                "createdDatetimetamp": new Date().getTime(),
                                                                "buildid": "-1",
                                                                "error": "HTTP-ERR" + BIresponse.statusCode,
                                                                "buildInfo": httperr,
                                                                "testResults": httperr
                                                            }, function (err, resp) {
                                                                if (err)
                                                                    console.log("Err: ", err)
                                                                else
                                                                    console.log("Data Saved!")
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        })


                                    }
                                })

                                if (BIresponse.statusCode == 404) {


                                }
                            }
                        }) //version request
                })
                //end request
        })

    }
    datamigration()
    new CronJob('*/15 * * * *', function () {
        datamigration()

    }, null, true, 'America/Los_Angeles')




}