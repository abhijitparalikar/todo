$(document).ready(function () {

    dialog = $("#newtask").dialog({
        autoOpen: false,
        height: 200,
        width: 350,
        modal: true,
        buttons: {
            "Add Task": addTask,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            dialog.dialog("close");
        }
    });

    $('#btnAddTask').on('click', function () {
        $('#taskTitle').val('');
        $('#taskDesc').val('');


        dialog.dialog("open");
    });

    function editTask(taskId) {
        alert('11');
        if ($('#status-' + taskId).text().trim().indexOf('Complete') < 0) {
            $('#editTaskId').val(taskId);
            $('#editedTitle').val($('#title-' + taskId).text().trim());
            $('#editedDesc').val($('#desc-' + taskId).text().trim());

            editdialog.dialog("open");
        }

    }

    function addTask() {
        var newTask = {
            Title: '',
            Description: ''
        };

        newTask.Title = $('#taskTitle').val();
        newTask.Description = $('#taskDesc').val();

        if ($.trim(newTask.Title) === '') {
            alert('Please enter a title for new task');
        }
        else {
            SaveNewTask(newTask);
            dialog.dialog("close");
        }

    };


    function SaveNewTask(task) {

        $.ajax({
            url: '/Home/AddTask',
            type: "POST",
            data: JSON.stringify(task),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response.TaskId === '00000000-0000-0000-0000-000000000000') {
                    alert('An error occured, please check your inputs and try again.');
                }
                else {
                    AddNewTaskRow(response.TaskId, response.Title, response.Description);
                }

            }
        });

    }

    editdialog = $("#edittask").dialog({
        autoOpen: false,
        height: 200,
        width: 350,
        modal: true,
        buttons: {
            "Save Task": saveTask,
            Cancel: function () {
                editdialog.dialog("close");
            }
        },
        close: function () {
            editdialog.dialog("close");
        }
    });

    function saveTask() {
        var newTask = {
            Id: '',
            Title: '',
            Description: ''
        };

        newTask.Id = $('#editTaskId').val();
        newTask.Title = $('#editedTitle').val();
        newTask.Description = $('#editedDesc').val();

        if ($.trim(newTask.Title) === '') {
            alert('Task title cannot be blank');
        }
        else {
            EditTask(newTask);
            editdialog.dialog("close");
        }

    };


    function EditTask(task) {
        $.ajax({
            url: '/Home/EditTask',
            type: "POST",
            data: JSON.stringify(task),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response === 'error') {
                    alert('An error occured.');
                }
                else {

                    $('#title-' + response.TaskId).text(response.Title);
                    $('#desc-' + response.TaskId).text(response.Description);
                }

            }
        });

    }

    function deleteTask(taskId) {

        $.ajax({
            url: '/Home/DeleteTask',
            type: "POST",
            data: '{taskId:"' + taskId + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response === 'error') {
                    alert('An error occured.');
                }
                else {
                    $('#' + taskId).hide();
                }

            }
        });
    }


    function markTaskComplete(taskId) {

        $.ajax({
            url: '/Home/TaskCompleted',
            type: "POST",
            data: '{taskId:"' + taskId + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response === 'error') {
                    alert('An error occured.');
                }
                else {
                    $('#status-' + taskId).html('Complete');
                    $('#' + taskId).addClass('completed');
                }

            }
        });

    }

    function AddNewTaskRow(taskId, title, description) {
        var detailsRow = $('#detailsRow');

        detailsRow.append('<div class="row" id=' + taskId + '>\
                    <div class="details col-xs-1" id="status-'+ taskId + '">\
                    <div class="detailsCell detailsCellLeft">\
                        Active\
                    </div>\
                </div>\
                <div class="details col-xs-3">\
                    <div class="detailsCell">\
                        <div id="title-'+ taskId + '">' + title + '\
                        </div>\
                    </div>\
                </div>\
                <div class="details col-xs-6">\
                    <div class="detailsCell">\
                        <div id="desc-'+ taskId + '">' + description + '\
                        </div>\
                    </div>\
                </div>\
                <div class="details detailsCell col-xs-2">\
                    <div id="modify-'+ taskId + '">\
                        <div class="Modify col-xs-4">\
                            <a href="#" title="Edit Task" onclick="javascript:editTask(&quot;'+ taskId + '&quot;)">\
                                <span class="glyphicon glyphicon-pencil"></span>\
                            </a>\
                        </div>\
                        <div class="Modify col-xs-4">\
                            <a href="#" title="Mark Complete" onclick="javascript:markTaskComplete(&quot;'+ taskId + '&quot;)">\
                                <span class="glyphicon glyphicon-ok"></span>\
                            </a>\
                        </div>\
                        <div class="Modify col-xs-4">\
                            <a href="#"  title="Delete Task" onclick="javascript:deleteTask(&quot;'+ taskId + '&quot;)">\
                                <span class="glyphicon glyphicon-trash"></span>\
                            </a>\
                        </div>\
                    </div>\
                </div>\
            </div>');
    }
});