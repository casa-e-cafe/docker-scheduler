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
    $('#newJob').on('submit', (e) => {
        e.preventDefault();
        $(e.target).find('input[type=submit]').attr('disabled', true);
        $.ajax({
            async: true,
            url: "/jobs",
            method: "PUT",
            data: $(e.target).serialize(),
            success: (response, status, xhr) => {
                $(e.target).find('input[type=submit]').attr('disabled', false);
                $(e.target).find('input[type=text]').val('');
                newScriptEditor.setValue('#!/bin/bash\n');
                jobsList.empty();
                updateJobs(jobsList);
                $(e.target).prepend(
                    <div class="alert alert-success alert-dismissable fade in">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>Success!</strong> Created job {xhr.responseJSON.name}
                    </div>
                );
            },
            error: (xhr, status, error) => {
                $(e.target).find('input[type=submit]').attr('disabled', false);
                $(e.target).prepend(
                    <div class="alert alert-danger alert-dismissable fade in">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>Error!</strong> {xhr.responseJSON.error}
                    </div>
                );
            }
        });
        return 0;
    });
});

function updateJobs(parentContainer) {
    $.ajax({
        async: true,
        url: "/jobs",
        method: "GET",
    }).done(response => {
        $.each(response, (index, value) => {
            // appends new job component to parentContainer
            jobComponent(value.name, value.cron, value.script, index, parentContainer);
        });
    });
}
