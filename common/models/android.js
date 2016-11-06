var async = require("async");
module.exports = function (Android) {
    // latest app End point /apps/latest
    Android.latest = function (cb) {


        Android.find(function (err, _resp) {
            if (!err) {
                var res = Math.max.apply(Math, _resp.map(function (o) {
                    return o.buildid;
                }))
                var obj = _resp.find(function (o) {
                    return o.buildid == res;
                })
                if (obj === undefined) {
                 cb(null ,[])
                } else
                    cb(null, obj)
            } else
                cb(err, [])

        })

    }

    Android.remoteMethod(
        'latest', {
            http: {
                path: '/latest',
                verb: 'get'
            },
            returns: {
                arg: 'data',
                type: 'object'
            }
        }
    );
    // end lates app End Point
};