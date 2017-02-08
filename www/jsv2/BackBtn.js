/**
 * BackBtn.js
 *
 * @author LuoWen
 * @date 20160307
 */
var utils = require('./Utils');

function BackBtn () {}
var p = BackBtn.prototype;

var BTN_TPL = 
'<button type="button" class="btn btn-default" style="margin:5px;position:absolute;z-index:99999;" aria-label="Left Align"">' +
//'返回' +
'    <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"><img class="img-responsive" src="img/back.png" alt=""></span>' +
'</button>';

p.init = function() {
    if(!utils.isOnResumeUpdate() && !utils.isAppJustInstall()) {
        if(window.history && window.history.length > 1) {
            $(BTN_TPL)
                .appendTo($('body'))
                .click(function () {
                    window.history.back();
                });
        }
    }
}


module.exports = new BackBtn();