/**
 * Created by LuoWen on 2016/1/12.
 */

var utils = require('./Utils'),
    CST = require('./Const').CST;

var MsgBox = function () {
    console.log("MsgBox init");
};

/**
 *
 * @deprecated
 * @param option
 * @returns {MsgBox}
 */
MsgBox.prototype.addMask = function (option) {
    var _option = {
        title: "Title",
        content: "Content",
        okBtn: "确定"
    };

    if (utils.isString(option)) option = {content: option}; //默认为String

    option = option || {};
    Object.keys(_option).forEach(function (key) {  // _.defaults
        option[key] = option[key] || _option[key];
    });

    var oBody = document.getElementsByTagName('body')[0];

    var msgMask = document.createElement("div");             //蒙灰背景
    //设置蒙灰背景样式
    msgMask.style.cssText = "background: black;z-Index: 999;left: 0;top: 0;opacity:0.7;";
    msgMask.style.width = window.innerWidth + 'px';
    msgMask.style.height = window.innerHeight + 'px';

    var msgDivTemplate = document.createElement("div");       //提示框
    msgDivTemplate.innerHTML =
        '<div style="padding:10px;margin-top:30px;color: #F77B00;font-size:35px;font-family:\'黑体\';font-weight: bold;text-align: center" id="messageContent">' +
        option.content +
        '</div>' +
        '<div style="text-align: center;margin-top: 15px;font-size:25px;font-family:\'黑体\';color:#F77B00;font-weight: bold;">' +
        '   <span><button id="okBtn" style="background-color:greenyellow;padding: 5px 15px;border-radius: 5px">' + option.okBtn + '</button></span>' +
        '</div>';
    //设置提示框样式
    msgDivTemplate.style.cssText = "width:500px;height:200px;background: #99E80B;border: 5px solid white;borderRadius: 10px;position: absolute;z-Index: 1000";
    msgDivTemplate.style.left = window.innerWidth / 2 - 250 + 'px';
    msgDivTemplate.style.top = window.innerHeight / 2 - 100 + 'px';
    //加入蒙灰背景节点和提示框节点
    oBody.appendChild(msgDivTemplate);
    oBody.appendChild(msgMask);

    return this;
};

MsgBox.prototype.generateNoty = function (option) {
    var _option = {
        type: "information",
        layout: "center",
        okBtn: "更新",
        text: 'TEXT'
    };

    if (utils.isString(option)) option = {text: option}; //默认为String

    option = option || {};
    Object.keys(_option).forEach(function (key) {  // _.defaults
        option[key] = option[key] || _option[key];
    });

    var n = noty({
        text        : option.text,
        type        : option.type,
        dismissQueue: true,
        layout      : option.layout,
        modal       : true,
        theme       : 'defaultTheme',
        animation: {
            open: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceInLeft'
            close: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceOutLeft'
            easing: 'swing',
            speed: 300 // opening & closing animation speed
        },
        buttons     : [
            {addClass: 'btn btn-primary', text: option.okBtn, onClick: function ($noty) {
                $noty.close();
                //noty({dismissQueue: true, force: true, layout: layout, theme: 'defaultTheme', text: 'You clicked "Ok" button', type: 'success'});
            }
            }
        ]
    });

    //console.log('html: ' + n.options.id);
    return this;
};

// MsgBox.prototype.show = function (option) {
//     //return this.addMask(option);
//     return this.generateNoty(option);
// };

MsgBox.prototype.generateSysNotification = function(message, confirmCallback, title, buttonLabels) {
    navigator.notification.confirm(message, confirmCallback, title, buttonLabels)
};

MsgBox.prototype.confirm = function (message, confirmCallback, title, buttonLabels) {
    return this.generateSysNotification(message, function(callbackIndex){
        if(callbackIndex === 1) confirmCallback(callbackIndex);
    }, title || CST.RESOUCES_UPDATE_TITLE, buttonLabels || [CST.RESOUCES_UPDATE_OK_BTN]);
};

// /**
//  * 为确认按钮添加点击事件
//  */
// MsgBox.prototype.okBtn = function(callback, scope, param) {
//     if(!utils.isArray(param)) param = [param];

//     document.getElementById('okBtn').onclick = function() {
//         callback.apply(scope, param);
//     };

//     noty({
//         callback: {
//             onClose: function () {
//                 callback.apply(scope, param);
//             }
//         }
//     });
// };

module.exports = new MsgBox();
