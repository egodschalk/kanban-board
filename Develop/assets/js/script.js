// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskFormEl = $('.task-form');
const taskTitleEl = $('#task-title');
const taskDueEl = $('#task-due');
const taskDescEl = $('#task-desc');
const taskButtonEl = $('.btn-primary');

function readTasksFromStorage() {

    let tasks = JSON.parse(localStorage.getItem('tasks'));

    if (!tasks) {
      tasks = [];
    }

    return tasks;
};

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomNum}`;
};

const taskId = generateTaskId();
console.log(taskId);

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCardEl = $('<div>')
        .addClass('task-card')
        .attr('data-task-id', task.taskId);
    const cardHeader = $('<h3>')
        .addClass('card-header')
        .text(task.title);
    const cardBody = $('<div>')
        .addClass('card-body');
    const cardDue = $('<p>')
        .addClass('card-text')
        .text(task.due);
    const cardDesc = $('<p>')
        .addClass('')
        .text(task.desc);
    const cardDeleteBtn = $('<button>')
        .addClass('')
        .attr('data-task-id', task.taskId)
        .text('Delete')

    cardDeleteBtn.on('click', handleDeleteTask);

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    
        if (now.isSame(taskDueDate, 'day')) {
          taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
          taskCard.addClass('bg-danger text-white');
          cardDeleteBtn.addClass('border-light');
        }
    
        cardBody.append(cardDesc, cardDue, cardDeleteBtn);
        taskCardEl.append(cardHeader, cardBody);
    
        return taskCardEl;
    };
};

function printTaskData() {
    const tasks = readTasksFromStorage();

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    };
};



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    const tasks = readTasksFromStorage();

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');

            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
};



// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskTitle = taskTitleEl.val().trim();
    const taskDue = taskDueEl.val();
    const taskDesc = taskDescEl.val();

    const newTask = {
        title: taskTitle,
        due: taskDue,
        desc: taskDesc,
        status: 'to-do',
    };

    const tasks = readTasksFromStorage();
    tasks.push(newTask);
      
    saveTasksToStorage(tasks);
      
    printTaskData();
      
    taskTitleEl.val('');
    taskDueEl.val('');
    taskDescEl.val('');
    
};

taskButtonEl.on('click', handleAddTask);

    // Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    tasks.forEach((task) => {
    if (task.id === taskId) {
        tasks.splice(tasks.indexOf(task), 1);
        }
    });

    saveTasksToStorage(tasks);

    renderTaskList();
};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();

    const taskIdEl = ui.draggable[0].dataset.taskId;
      
    const newStatus = event.target.id;
      
    for (let task of tasks) {
        if (task.id === taskIdEl) {
        task.status = newStatus;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    printTaskData();
};

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    printTaskData();

    $('#taskDue').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });
});


taskFormEl.on('submit', handleAddTask);

// taskDisplayEl.on('click', '.btn-delete-task', handleDeleteTask);