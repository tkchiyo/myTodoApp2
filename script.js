document.getElementById('add-todo').addEventListener('click', addTodo);
document.getElementById('new-todo').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});
document.getElementById('complete-all').addEventListener('click', completeAllTodos);
document.getElementById('revive-all').addEventListener('click', reviveAllTodos);
document.getElementById('add-bulk-todos').addEventListener('click', addBulkTodos);

window.onload = function() {
    loadTodos();
};

function addTodo() {
    const todoText = document.getElementById('new-todo').value;
    if (todoText === '') return;

    createTodoItem(todoText);

    document.getElementById('new-todo').value = '';
    saveTodos();
}

function addBulkTodos() {
    const bulkText = document.getElementById('bulk-todos').value;
    const todos = bulkText.split('\n').filter(todo => todo.trim() !== '');
    todos.forEach(todo => createTodoItem(todo));
    
    document.getElementById('bulk-todos').value = '';
    saveTodos();
}

function createTodoItem(todoText) {
    const todoList = document.getElementById('todo-list');
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    
    const todoSpan = document.createElement('span');
    todoSpan.textContent = todoText;
    
    const completeButton = document.createElement('button');
    completeButton.textContent = '完了';
    completeButton.className = 'complete-button';
    completeButton.addEventListener('click', () => {
        toggleCompleted(todoSpan, completeButton);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
        deleteTodoItem(todoItem);
    });

    todoItem.appendChild(todoSpan);
    todoItem.appendChild(completeButton);
    todoItem.appendChild(deleteButton);
    todoList.appendChild(todoItem);
}

function deleteTodoItem(todoItem) {
    todoItem.remove();
    saveTodos();
}

function toggleCompleted(todoSpan, completeButton) {
    if (todoSpan.style.textDecoration === 'line-through') {
        todoSpan.style.textDecoration = '';
        todoSpan.style.color = '';
        completeButton.textContent = '完了';
        completeButton.className = 'complete-button';
    } else {
        todoSpan.style.textDecoration = 'line-through';
        todoSpan.style.color = 'gray';
        completeButton.textContent = '復活';
        completeButton.className = 'revive-button';
        createEmojiEffect(completeButton, '💥');
    }
    saveTodos();
}

function createEmojiEffect(element, emoji) {
    const rect = element.getBoundingClientRect();
    
    const emojiElement = document.createElement('div');
    emojiElement.className = 'emoji';
    emojiElement.style.left = `${rect.left + rect.width / 2}px`;
    emojiElement.style.top = `${rect.top + rect.height / 2}px`;
    emojiElement.textContent = emoji;
    
    const explosionContainer = document.getElementById('explosion-container');
    if (explosionContainer) {
        explosionContainer.appendChild(emojiElement);
        setTimeout(() => emojiElement.remove(), 2000);
    } else {
        console.error('Explosion container not found.');
    }
}

function completeAllTodos() {
    const todoItems = document.querySelectorAll('.todo-item span');
    const completeButtons = document.querySelectorAll('.complete-button, .revive-button');
    todoItems.forEach((todoSpan, index) => {
        todoSpan.style.textDecoration = 'line-through';
        todoSpan.style.color = 'gray';
        completeButtons[index].textContent = '復活';
        completeButtons[index].className = 'revive-button';
    });
    saveTodos();
}

function reviveAllTodos() {
    const todoItems = document.querySelectorAll('.todo-item span');
    const completeButtons = document.querySelectorAll('.complete-button, .revive-button');
    todoItems.forEach((todoSpan, index) => {
        todoSpan.style.textDecoration = '';
        todoSpan.style.color = '';
        completeButtons[index].textContent = '完了';
        completeButtons[index].className = 'complete-button';
    });
    saveTodos();
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(todoItem => {
        const todoSpan = todoItem.querySelector('span');
        const completeButton = todoItem.querySelector('button');
        todos.push({
            text: todoSpan.textContent,
            completed: todoSpan.style.textDecoration === 'line-through'
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos'));
    if (todos) {
        todos.forEach(todo => {
            createTodoItem(todo.text);
            if (todo.completed) {
                const todoItem = document.querySelector('#todo-list li:last-child');
                const todoSpan = todoItem.querySelector('span');
                const completeButton = todoItem.querySelector('button');
                toggleCompleted(todoSpan, completeButton);
            }
        });
    }
}
