'use strict';
module.exports = function(app){
    var matchController = require('../Controllers/controller');
    
    app.route('/targeting')
        .get(matchController.findTargeting);
};
