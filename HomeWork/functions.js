const fs = require('fs');

function readTodos() {
    let todos = [];
    const data = fs.readFileSync('./storage.json', 'utf8');
    const jsonData = JSON.parse(data);
    todos.push(...jsonData);
    return todos;
}

/**
 * Очищает задачи todo, перезаписывая содержимое файла storage.json пустым массивом.
 * @function clearTodoItems
 * @returns {void}
 */
function clearTodoItems() {
    fs.writeFileSync('./storage.json', '[]', 'utf8');
    console.log('Data cleared from storage.json');
}

/**
 * Добавляет задачу в список todo и сохраняет в файл storage.json.
 * @param {Object} todo - объект задачи
 * @returns {void}
 */
function addTodoItem(todo) {
    const todos = readTodos();
    todos.push(todo);
    fs.writeFileSync('./storage.json', JSON.stringify(todos), 'utf8');
    console.log('Data saved to storage.json');
}

/**
 * Удаляет задачу из списка todo по её идентификатору.
 * @param {number} taskId - идентификатор задачи, которую нужно удалить
 * @returns {boolean} - возвращает true, если задача была удалена, иначе false
 */
function deleteTodoItem(taskId) {
    const todos = readTodos();
    const updatedTodos = todos.filter(task => task.id !== taskId);
    fs.writeFileSync('./storage.json', JSON.stringify(updatedTodos), 'utf8');
    return updatedTodos.length < todos.length;
}

module.exports = { addTodoItem, clearTodoItems, readTodos, deleteTodoItem };
