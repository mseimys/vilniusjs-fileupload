'use strict';
window.onload = function(global) {
    var form = global.document.createElement('form');
    var input = global.document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', 'multiple');
    input.addEventListener('change', function() {
        [].slice.call(input.files).forEach(function(file) {
            global.console.log(file);

            var progressContainer = global.document.createElement('p');
            var progress = global.document.createElement('progress');
            progress.setAttribute('max', file.size);
            progressContainer.appendChild(global.document.createTextNode(file.name + ': ' + file.size + ' bytes'));
            progressContainer.appendChild(progress);
            global.document.body.appendChild(progressContainer);

            var href = '/files/' + file.name;
            global.httpinvoke(href, 'POST', {
                input: file,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            }).then(function(response) {
                if(response.statusCode === 204) {
                    var link = global.document.createElement('a');
                    link.setAttribute('href', href);
                    link.appendChild(global.document.createTextNode('here'));
                    progressContainer.replaceChild(global.document.createTextNode(', uploaded '), progress);
                    progressContainer.appendChild(link);
                } else {
                    progressContainer.replaceChild(global.document.createTextNode(', errored with HTTP status ' + response.statusCode), progress);
                }
            }, function(err) {
                progressContainer.replaceChild(global.document.createTextNode(', errored with message ' + err.message), progress);
            }, function(progressEvent) {
                if(progressEvent.type === 'upload') {
                    progress.setAttribute('value', progressEvent.current);
                }
            });
        });
        form.reset();
    });

    form.appendChild(input);
    global.document.body.appendChild(form);
}.bind(null, window);
