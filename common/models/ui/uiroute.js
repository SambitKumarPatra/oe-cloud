/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
* @classdesc This model stores the data to auto configure, application level client side routing using page.js
* The model has following properties
* Property |              Description
* ---------|-------------------------------
* `name`   | route name
* `path`   | relative url along with placeholders e.g. /customer/:id
* `type`   | <ul><li>page -> html data from "import" is fetched and added as innerHtml of target.</li><li>meta -> ui-metadata from "import" is fetched, component is generated and added inside target</li><li>list -> <ev-model-list> with relevant "import" is added inside target</li><li>elem -> If element with 'name' is NOT registered yet, 'import' is href-imported and 'name' element is added.</li></ul>
* `import` | as explained above
* `target` | element-query-selection for target element, non-mandatory the default taken from specified global.
*
* e.g.
*
*    [{
*        "type": "page",
*        "name": "receipts",
*        "path": "/receipts",
*        "import": "receipts-partial.html"
*    },
*    {
*        "type": "elem",
*        "name": "cfe-loan-details",
*        "path": "/loan",
*        "import": "../business/cfe-loan-details.html"
*    }]
*
* Note: If you specify `path` as "@default", the current location.pathname is configured to execute that route.
* This then also becomes the default 404 handler.
*
*
* @kind class
* @class UIRoute
* @author Rohit Khode
*/

/*
* this method can be overriden in application in boot script
* to have different behaviour
*/

module.exports = function uiRoute(UIRoute) {
  var routes = {};

  UIRoute.prototype.redirectHandler = function redirectHandler(app) {
    if (!routes[this.path]) {
      app.get(this.path, function getPath(req, res) {
        res.redirect('/?redirectTo=' + req.originalUrl);
      });
    }
    routes[this.path] = true;
  };
};
