// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));
const formEl = $('#task-form');
// Todo: create a function to generate a unique task id
function generateTaskId() {
    
    const randomId = Math.random().toString(36);
    return randomId;

}
// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $('<div class="task-card">');
    card.append(`<h2>${task.title}</h2>`);
    card.append(`<p>${task.description}</p>`);
    card.append(`<p>Due Date: ${task.dueDate}</p>`);
    card.append(`<button class="delete-task-btn">Delete</button>`);
 
    return card;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskListContainer = $('#todo-cards');

    taskListContainer.empty();

    // Loop through tasks and create task cards
    taskList.forEach(task => {
        const card = createTaskCard(task);
        applyStyles(card,task.dueDate);
        card.draggable({
            revert: "invalid", // Snap back to original position if not dropped in a droppable target
            zIndex: 1000, // Ensure card appears above other elements
            cursor: "move" // Change cursor to indicate draggability
        });
    
        taskListContainer.append(card);
    });
}

// Todo: create a function to handle adding a new task
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
        status: 'todo'
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    
    renderTaskList(taskList);
    $('#task-title').val('');
    $('#task-description').val('');
    $('#task-due-date').val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
   const currentTask = $(event.target).closest('.task-card');
   const taskId = currentTask;
    console.log(taskId);
    // Filter out the task with the matching taskId
    taskList = taskList.filter(task => task.id !== taskId);

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
}

function applyStyles(card, dueDate) {
    const today = dayjs();
    
    const taskDueDate = dayjs(dueDate);

    if (taskDueDate.diff(today, 'day') < 0) {
        card.addClass('past-due');
    } else if (taskDueDate.diff(today, 'day') === 0) {
        card.addClass('due-today'); 
    } else {
        card.addClass('due-future'); 
    }
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    formEl.submit(handleAddTask);
    console.log(taskList);
  
    $(document).on('click', '.delete-task-btn', handleDeleteTask);
    
});
