(function(){
    // Retrieved and slightly modified from: https://github.com/typicode/pegasus
    // --------------------------------------------------------------------------
    //
    // a   url (naming it a, beacause it will be reused to store callbacks)
    // xhr placeholder to avoid using var, not to be used
    window.pegasus = function pegasus(a, xhr) {
        xhr = new XMLHttpRequest();

        // Open url
        xhr.open('GET', a);

        // Reuse a to store callbacks
        a = [];

        // onSuccess handler
        // onError   handler
        // cb        placeholder to avoid using var, should not be used
        xhr.onreadystatechange = xhr.then = function(onSuccess, onError, cb) {

            // Test if onSuccess is a function or a load event
            if (onSuccess.call) a = [onSuccess, onError];

            // Test if request is complete
            if (xhr.readyState == 4) {

                // index will be:
                // 0 if status is between 0 and 399
                // 1 if status is over
                cb = a[0|xhr.status / 400];

                // Safari doesn't support xhr.responseType = 'json'
                // so the response is parsed
                if (cb) cb(xhr.status === 200 || xhr.status === 0?JSON.parse(xhr.responseText):xhr);
            }
        };

        // Send
        xhr.send();

        // Return request
        return xhr;
    };
});