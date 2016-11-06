var loopback = require('loopback');
var boot = require('loopback-boot');
var jsonfile = require('jsonfile')

var app = module.exports = loopback();

var errorFile = 'error.json'

var appsFile = 'apps.json'

var path = require('path');
app.use(loopback.static(path.resolve(__dirname, '../client')));

app.start = function () {
    app["myconstants"] = {}
    // start the web server
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
            jsonfile.readFile(appsFile, function (err, obj) {
                if (!err) {
                    app.myconstants["appcalls"] = obj;
                }
            })


        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();


});