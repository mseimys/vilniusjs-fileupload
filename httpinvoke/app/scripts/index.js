'use strict';
(function(global) {

var handle = function(source, type, handler) {
    if(source.addEventListener) {
        source.addEventListener(type, handler, false);
    } else if(source.attachEvent) {
        source.attachEvent('on' + type, handler);
    } else {
        throw new Error();
    }
};

handle(global, 'load', function() {
    var form = global.document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('enctype', 'multipart/form-data');
    form.setAttribute('encoding', 'multipart/form-data');
    form.setAttribute('action', '/multipart_files');
    var input = global.document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', 'multiple');
    handle(input, 'change', function() {
        if(typeof input.files === 'undefined') {
            var name = 'file_upload_' + Date.now();
            var iframe = global.document.createElement('iframe');
            iframe.style.borderWidth = '0px';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.setAttribute('name', name);
            iframe.setAttribute('id', name);
            global.document.body.appendChild(iframe);
            global.frames[name].name = name;
            form.setAttribute('target', name);
            input.setAttribute('name', name);

            var progressContainer = global.document.createElement('p');
            global.document.body.appendChild(progressContainer);
            progressContainer.appendChild(global.document.createTextNode(input.value + ': '));
            handle(iframe, 'load', function() {
                global.document.body.removeChild(iframe);
                progressContainer.appendChild(global.document.createTextNode('uploaded '));
                var link = global.document.createElement('a');
                link.setAttribute('href', '/files/' + name);
                link.appendChild(global.document.createTextNode('here'));
                progressContainer.appendChild(link);
                form.reset();
            });
            form.submit();

            return;
        }
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
});

})(window);
