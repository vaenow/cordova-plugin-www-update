/**
 * Created by LuoWen on 2016/1/12.
 */

$.noty.defaults = {
    layout: 'top',
    theme: 'defaultTheme', // or 'relax'
    type: 'confirm',
    text: '', // can be html or string
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: {
        open: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceInLeft'
        close: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceOutLeft'
        easing: 'swing',
        speed: 500 // opening & closing animation speed
    },
    timeout: false, // delay for closing event. Set false for sticky notifications
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 5, // you can set max visible notification for dismissQueue true option,
    killer: false, // for close all notifications before show
    closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
    callback: {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {},
        onCloseClick: function() {},
    },
    buttons: [
        {addClass: 'btn btn-primary', text: 'Ok', onClick: function($noty) {

            // this = button element
            // $noty = $noty element

            $noty.close();
            noty({text: 'You clicked "Ok" button', type: 'success'});
        }
        },
        {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
            $noty.close();
            noty({text: 'You clicked "Cancel" button', type: 'error'});
        }
        }
    ] // an array of buttons
};