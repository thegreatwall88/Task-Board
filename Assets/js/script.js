// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

function generateTaskId() {

    const randomId = Math.random().toString(36);
    return randomId;

}

function createTaskCard(task) {
    const card = $(`<div class="task-card" id = ${task.id} status = ${task.status}>`);
    card.append(`<h2>${task.title}</h2>`);
    card.append(`<p>${task.description}</p>`);
    card.append(`<p>Due Date: ${task.dueDate}</p>`);
    card.append(`<button class="delete-task-btn">Delete</button>`);

    return card;

}

function renderTaskList() {
    const lanes = {
        todo: $('#todo-cards'),
        'in-progress': $('#in-progress-cards'),
        done: $('#done-cards')
    };
    for (const lane in lanes) {
        lanes[lane].empty();
    }
    // Loop through tasks and create task cards
    taskList.forEach(task => {
        const card = createTaskCard(task);
        applyStyles(card, task.dueDate);
        card.draggable({
            revert: "invalid",
            zIndex: 1000,
            cursor: "move"
        });
        lanes[task.status].append(card);
    });
}


function handleAddTask(event) {
    event.preventDefault();
    const titleEl = $('#task-title').val();
    const descriptionEl = $('#task-description').val();
    const dueDateEl = $('#task-due-date').val();
    const newTask = {
        id: generateTaskId(),
        title: titleEl,
        description: descriptionEl,
        dueDate: dueDateEl,
        status: "todo"
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    renderTaskList(taskList);
    $('#task-title').val('');
    $('#task-description').val('');
    $('#task-due-date').val('');
    $('.modal').modal('hide');

}


function handleDeleteTask(event) {
    const currentTask = event.target.closest('.task-card');
    const idToDelete = currentTask.getAttribute('id');
    const indexToDelete = taskList.findIndex(task => task.id === idToDelete);

    if (indexToDelete !== -1) {
        taskList.splice(indexToDelete, 1);
    }
    // Update localStorage with the modified taskList
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}


function handleDrop(event, ui) {
    const taskId = $(ui.draggable[0]).attr('id');
    const newStatus = $(event.target).closest('.lane').attr('id').replace('-cards', '');
    const taskIndex = taskList.findIndex(task => task.id == taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        let backgroundColor = '';
        if (newStatus === 'done') {
            backgroundColor = '#ffffff';
        } else if (newStatus === 'in-progress') {
            backgroundColor = '#f8d302';
        }

        $(ui.draggable).appendTo(`#${newStatus}-cards`).css({
            top: '0px',
            left: '0px',
            'background-color': backgroundColor // Apply the background color
        });
        console.log(`Task ${taskId} moved to ${newStatus}`);
    } else {
        console.error(`Task with ID ${taskId} not found`);
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));

}

function applyStyles(card, dueDate) {
    const today = dayjs();
    const taskDueDate = dayjs(dueDate);
    //if (card.attr('status') === 'todo') {
        if (taskDueDate.diff(today, 'day') < 0) {
            card.addClass('past-due');
        } else if (taskDueDate.diff(today, 'day') === 0) {
            card.addClass('due-today');
        } else {
            card.addClass('due-future');
        }
   // }
}

$(document).ready(function () {
    renderTaskList();
    $('#form-modal').submit(handleAddTask);
    $(document).on('click', '.delete-task-btn', handleDeleteTask);
    $(`.lane`).droppable({
        accept: ".task-card",

        drop: handleDrop

    });
});
