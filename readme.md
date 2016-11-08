

E2E Testing Dashboard!
=====================

"End 2 End Testing Dashboard" is an application for creating Application Tests and reviewing them at the same time


Dashboard App Docs!
-----------------


Before deploying this application it is supposed that you have installed  **NodeJS** in your machine.. If not then you can install nodejs by following these [instruction] [1]

----------
Install loopback
-------------

[**Loopback**][2] is The Node.js API Framework


>  $ npm install -g strongloop



Install node_modules
------------------------------------
>  $ npm install 


Install PM2 for Production Environment (Optional)
------------------------------------

[**PM2**][3] is Advanced, production process manager for Node.js


> $ npm install pm2 -g



Deploy the application
----------------------

Run the following command to projects root directory.


> $ pm2 start server/server.js

OR

> $ node .





### Adding New App

- to add new app create the replica of app-1.js and app-1.json in common/modals/ directory.

- rename the files with new app-n.js and app-n.json, (n can be any number [optional standard]). 

- open both files and replace the App1 with Appn (n can be any number [optional standard])

- open server/boot/corn.js and add new object according to the new app you added.

- restart the server or (in pm2 you can watch the cron.js file for any changes and it will automatically restart on change).
**your new app is added**

  [1]: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-a-centos-7-server
  [2]: http://loopback.io/ 
  [3]: http://pm2.keymetrics.io/ 