const fs = require('fs');
const path = require('path');
const readline = require('readline');

const tasksFilePath = path.join(__dirname, 'tasks.json');
const tasksTxtFilePath = path.join(__dirname, 'tasks.txt');

// Ensure tasks file exists
if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}

// Read tasks from file
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
}

// Write tasks to file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    writeTasksToTxt(tasks); // Also update tasks.txt
}

// Write tasks to tasks.txt
const writeTasksToTxt = (tasks) => {
    const tasksContent = tasks.map((task, index) =>
        `${index + 1}. ${task.description} [${task.completed ? 'Completed' : 'Not Completed'}]`
    ).join('\n');
    fs.writeFileSync(tasksTxtFilePath, tasksContent, 'utf-8');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const menu = () => {
    console.log(`
        1. Add a new task
        2. View a list of tasks
        3. Mark a task as complete
        4. Remove a task
        5. Exit
    `);
    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                addTask();
                break;
            case '2':
                viewTasks();
                break;
            case '3':
                markTaskComplete();
                break;
            case '4':
                removeTask();
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option');
                menu();
                break;
        }
    });
}

const addTask = () => {
    rl.question('Enter the task description: ', (description) => {
        const tasks = readTasks();
        tasks.push({ description, completed: false });
        writeTasks(tasks);
        console.log('Task added.');
        menu();
    });
}

const viewTasks = () => {
    const tasks = readTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
    } else {
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.description} [${task.completed ? 'Completed' : 'Not Completed'}]`);
        });
    }
    menu();
}

const markTaskComplete = () => {
    const tasks = readTasks();
    rl.question('Enter the task number to mark as complete: ', (taskNumber) => {
        const index = parseInt(taskNumber) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks[index].completed = true;
            writeTasks(tasks);
            console.log('Task marked as complete.');
        } else {
            console.log('Invalid task number.');
        }
        menu();
    });
}

const removeTask = () => {
    const tasks = readTasks();
    rl.question('Enter the task number to remove: ', (taskNumber) => {
        const index = parseInt(taskNumber) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            writeTasks(tasks);
            console.log('Task removed.');
        } else {
            console.log('Invalid task number.');
        }
        menu();
    });
}

menu();
