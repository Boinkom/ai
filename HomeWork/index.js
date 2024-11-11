const express = require('express');
const fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 

app.get('/', (req, res) => {
    fs.readFile('./home.html', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('An error occurred');
        }
        res.send(data);
    });
});

/**
 * Reads the todos from the storage file.
 * @returns {Array} An array of todos.
 */
function readTodos() {
    let todos = [];
    const data = fs.readFileSync('./storage.json', 'utf8');
    const jsonData = JSON.parse(data);
    todos.push(...jsonData);
    return todos;
}

/**
 * Clears the todo items by overwriting the contents of the storage.json file with an empty array.
 * @function clearTodoItems
 * @returns {void}
 */
function clearTodoItems() {
    fs.writeFile('./storage.json', '[]', 'utf8', (err) => {
        if (err) {
            return;
        }
        console.log('Data cleared from storage.json');
    });
}

app.post('/todos', (req, res) => {
    const { title } = req.body;
    const todos = readTodos();
    const newTodo = {
        id: generateUniqueId(),
        title,
        completed: false
    };
    todos.push(newTodo);
    saveTodos(todos);
    res.status(201).json(newTodo);
});

app.get('/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
        res.status(404).send('Todo not found');
        return;
    }
    todos[todoIndex].completed = true;
    saveTodos(todos);
    res.send('Todo marked as completed');
});

app.put('/todos/:id/incomplete', (req, res) => {
    const { id } = req.params;
    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
        res.status(404).send('Todo not found');
        return;
    }
    todos[todoIndex].completed = false;
    saveTodos(todos);
    res.send('Todo marked as incomplete');
});

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function saveTodos(todos) {
    fs.writeFileSync('./storage.json', JSON.stringify(todos), 'utf8');
}

app.listen(3000, () => console.log('Server is running on port http://localhost:3000'));
