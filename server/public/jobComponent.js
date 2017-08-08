function jobComponent(header, cron, script, index, parent) {
    const scriptTextArea = React.createElement(
        'textarea',
        { id: 'job' + index + 'script', 'class': 'panel-body', name: 'script' },
        script
    );

    const heading = React.createElement(
        'div',
        { 'class': 'panel-heading collapsed', 'data-toggle': 'collapse', 'data-parent': 'jobs-accordion', href: '#job' + index },
        React.createElement(
            'h4',
            { 'class': 'panel-title' },
            header,
            React.createElement('a', { 'class': 'float right expand-icon' })
        )
    );

    const nameInput = React.createElement('input', { id: 'name' + index, type: 'text', 'class': 'form-control col-10', value: header, name: 'name', readonly: true });
    const cronInput = React.createElement('input', { id: 'cron' + index, type: 'text', 'class': 'form-control col-10', value: cron, name: 'cron', readonly: true });

    const editButton = React.createElement(
        'button',
        { 'class': 'btn btn-md btn-success button', 'data-edit': 'true' },
        'Edit'
    );
    const saveEditionButton = React.createElement(
        'button',
        { 'class': 'btn btn-md btn-primary button', disabled: true },
        'Save'
    );
    const deleteButton = React.createElement(
        'button',
        { 'class': 'btn btn-md btn-danger button' },
        'Delete'
    );

    const collapse = React.createElement(
        'div',
        { id: 'job' + index, 'class': 'collapse panel-collapse' },
        React.createElement(
            'form',
            { id: 'job' + index + 'form', 'class': 'jobBox' },
            React.createElement(
                'div',
                { 'class': 'form-group col-8' },
                React.createElement(
                    'label',
                    { 'for': 'name' + index, 'class': 'col-2' },
                    'Name:'
                ),
                nameInput
            ),
            React.createElement(
                'div',
                { 'class': 'form-group col-8' },
                React.createElement(
                    'label',
                    { 'for': 'cron' + index, 'class': 'col-2' },
                    'Cron string:'
                ),
                cronInput
            ),
            React.createElement(
                'div',
                { 'class': 'form-group col-8' },
                React.createElement(
                    'label',
                    { 'for': 'job' + index + 'script', 'class': 'col-2' },
                    'Script:'
                ),
                scriptTextArea
            ),
            React.createElement(
                'div',
                { 'class': 'right' },
                editButton,
                saveEditionButton,
                React.createElement(
                    'div',
                    { 'class': 'float-right' },
                    deleteButton
                )
            )
        )
    );

    const output = React.createElement(
        'div',
        { 'class': 'panel panel-default' },
        heading,
        collapse
    );

    parent.append($(output));

    const coisas = document.getElementById('job' + index + 'script');

    const editor = CodeMirror.fromTextArea(coisas, codeMirrorOptions(true));
    editor.on('focus', (instance, e) => {
        instance.refresh();
    });

    $(output).on('shown.bs.collapse', e => {
        editor.refresh();
    });

    $(editButton).click(e => {
        e.preventDefault();
        if (!!$(editButton).data('edit')) {
            $(editButton).data('edit', false);
            $(editButton).text("Cancel");
            $(editButton).removeClass('btn-primary');
            $(editButton).addClass('btn-danger');
            $(saveEditionButton).attr('disabled', false);
            $(deleteButton).attr('disabled', true);
            $(cronInput).attr('readonly', false);
            editor.setOption('readOnly', false);
        } else {
            $(editButton).data('edit', true);
            $(editButton).text("Edit");
            $(editButton).removeClass('btn-danger');
            $(editButton).addClass('btn-primary');
            $(saveEditionButton).attr('disabled', true);
            $(deleteButton).attr('disabled', false);
            $(cronInput).attr('readonly', true);
            $(cronInput).val(cron);
            editor.setValue(script);
            editor.setOption('readOnly', true);
        }
        return false;
    });

    $(saveEditionButton).click(e => {
        e.preventDefault();
        $(e.target).attr('disabled', true);
        $.ajax({
            async: true,
            url: "/jobs",
            method: "POST",
            data: $('#job' + index + 'form').serialize(),
            success: (response, status, xhr) => {
                $(e.target).attr('disabled', false);
                parent.empty();
                updateJobs(parent);
            },
            error: (xhr, status, error) => {
                $(e.target).attr('disabled', false);
            }
        });
        return false;
    });
}