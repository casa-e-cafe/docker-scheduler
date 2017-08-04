function jobComponent(header, cron, script, index) {
    const scriptTextArea = <textarea id={'job' + index + 'script'} class="panel-body">
        {script}
    </textarea>;

    const heading = <div class="panel-heading collapsed" data-toggle="collapse" data-parent="jobs-accordion" href={'#job' + index}>
            <h4 class="panel-title">
                {header}
                <a class="float right expand-icon" />
            </h4>
        </div>;

    const nameInput = <input id={'name' + index} type="text" class="form-control col-10" value={header} name="name" readonly/>;
    const cronInput = <input id={'cron' + index} type="text" class="form-control col-10" value={cron} name="cron" readonly/>;

    const editButton = <button class="btn btn-md btn-success button" data-edit="true" >Edit</button>;
    const saveEditionButton = <button class="btn btn-md btn-primary button" disabled >Save</button>;
    const deleteButton = <button class="btn btn-md btn-danger button" >Delete</button>;

    const collapse = <div id={'job' + index} class="collapse panel-collapse">
            <form id={'job' + index} class="jobBox">
                <div class="form-group col-8">
                    <label for={'name' + index} class="col-2">Name:</label>
                    {nameInput}
                </div>
                <div class="form-group col-8">
                    <label for={'cron' + index} class="col-2">Cron string:</label>
                    {cronInput}
                </div>
                <div class="form-group col-8">
                    <label for={'job' + index + 'script'} class="col-2">Script:</label>
                    {scriptTextArea}
                </div>
                <div class="right">
                    {editButton}
                    {saveEditionButton}
                    <div class="float-right">
                        {deleteButton}
                    </div>
                </div>
            </form>
        </div>;

    const output = <div class="panel panel-default">
        {heading}
        {collapse}
    </div>;

    const editor = CodeMirror.fromTextArea(scriptTextArea, codeMirrorOptions(true));
    editor.on('focus', (instance, e) => {
        instance.refresh();
    });

    $(output).on('shown.bs.collapse', (e) => {
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
            $(nameInput).attr('readonly', false);
            $(cronInput).attr('readonly', false);
            editor.setOption('readOnly', false);
        } else {
            $(editButton).data('edit', true);
            $(editButton).text("Edit");
            $(editButton).removeClass('btn-danger');
            $(editButton).addClass('btn-primary');
            $(saveEditionButton).attr('disabled', true);
            $(deleteButton).attr('disabled', false);
            $(nameInput).attr('readonly', true);
            $(nameInput).val(header);
            $(cronInput).attr('readonly', true);
            $(cronInput).val(cron);
            editor.setValue(script);
            editor.setOption('readOnly', true);
        }
        return false;
    });

    return $(output);
}
