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
    initializeSortable();
};

function addTodo() {
    const todoText = document.getElementById('new-todo').value;
    if (todoText === '') return;

    const todoList = document.getElementById('todo-list');
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    
    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.textContent = '≡';

    const todoSpan = document.createElement('span');
    todoSpan.className = 'todo-text';
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

    todoItem.appendChild(dragHandle);
    todoItem.appendChild(todoSpan);
    todoItem.appendChild(completeButton);
    todoItem.appendChild(deleteButton);
    todoList.appendChild(todoItem);

    document.getElementById('new-todo').value = '';
    saveTodos();
}

function toggleCompleted(todoSpan, completeButton) {
    if (todoSpan.classList.contains('completed')) {
        todoSpan.classList.remove('completed');
        completeButton.textContent = '完了';
        completeButton.className = 'complete-button';
    } else {
        todoSpan.classList.add('completed');
        completeButton.textContent = '復活';
        completeButton.className = 'revive-button';
    }
    saveTodos();
}

function deleteTodoItem(todoItem) {
    todoItem.remove();
    saveTodos();
}

function completeAllTodos() {
    const todos = document.querySelectorAll('.todo-item .todo-text');
    const buttons = document.querySelectorAll('.complete-button');
    todos.forEach((todo, index) => {
        todo.classList.add('completed');
        buttons[index].textContent = '復活';
        buttons[index].className = 'revive-button';
    });
    saveTodos();
}

function reviveAllTodos() {
    const todos = document.querySelectorAll('.todo-item .todo-text');
    const buttons = document.querySelectorAll('.revive-button');
    todos.forEach((todo, index) => {
        todo.classList.remove('completed');
        buttons[index].textContent = '完了';
        buttons[index].className = 'complete-button';
    });
    saveTodos();
}

function addBulkTodos() {
    const bulkText = document.getElementById('bulk-todos').value;
    const todos = bulkText.split('\n');
    todos.forEach(todoText => {
        if (todoText.trim() !== '') {
            const todoList = document.getElementById('todo-list');
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            
            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.textContent = '≡';

            const todoSpan = document.createElement('span');
            todoSpan.className = 'todo-text';
            todoSpan.textContent = todoText.trim();
            
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

            todoItem.appendChild(dragHandle);
            todoItem.appendChild(todoSpan);
            todoItem.appendChild(completeButton);
            todoItem.appendChild(deleteButton);
            todoList.appendChild(todoItem);
        }
    });
    document.getElementById('bulk-todos').value = '';
    saveTodos();
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(todo => {
        const todoText = todo.querySelector('.todo-text').textContent;
        const completed = todo.querySelector('.todo-text').classList.contains('completed');
        todos.push({ text: todoText, completed: completed });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const todoList = document.getElementById('todo-list');
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.textContent = '≡';

        const todoSpan = document.createElement('span');
        todoSpan.className = 'todo-text';
        todoSpan.textContent = todo.text;
        if (todo.completed) {
            todoSpan.classList.add('completed');
        }
        
        const completeButton = document.createElement('button');
        completeButton.textContent = todo.completed ? '復活' : '完了';
        completeButton.className = todo.completed ? 'revive-button' : 'complete-button';
        completeButton.addEventListener('click', () => {
            toggleCompleted(todoSpan, completeButton);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            deleteTodoItem(todoItem);
        });

        todoItem.appendChild(dragHandle);
        todoItem.appendChild(todoSpan);
        todoItem.appendChild(completeButton);
        todoItem.appendChild(deleteButton);
        todoList.appendChild(todoItem);
    });
}

function initializeSortable() {
    new Sortable(document.getElementById('todo-list'), {
        handle: '.drag-handle',
        animation: 150,
        onEnd: saveTodos
    });
}
