const codeMirrorOptions = (readOnly) => ({
    mode: 'shell',
    theme: 'monokai',
    autoClearEmptyLines: true,
    autofocus: true,
    lineNumbers: true,
    gutter: true,
    lineWrapping: true,
    readOnly: readOnly
});

$(document).ready(() => {
    const jobsList = $('#jobs-accordion');
    updateJobs(jobsList);
    const newScriptEditor = CodeMirror.fromTextArea(
        document.getElementById('newscript'), codeMirrorOptions(false)
    );
    newScriptEditor.on('focus', (instance, e) => {
        instance.refresh();
    });
    newScriptEditor.setValue('#!/bin/bash\n');
    $('form').on('submit', (e) => {
        e.preventDefault();
        console.log('ohgod');
        return 0;
    });
});

function updateJobs(parentContainer) {
    $.ajax({
        "async": true,
        "url": "/jobs",
        "method": "GET",
    }).done(response => {
        $.each(response, (index, value) => {
            const job = jobComponent(value.name, value.cron, value.script, index);
            parentContainer.append(job);
        });
    });
}
