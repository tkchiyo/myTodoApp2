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
    enableDragAndDrop();
};

function addTodo() {
    const todoText = document.getElementById('new-todo').value;
    if (todoText === '') return;

    const todoList = document.getElementById('todo-list');
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.draggable = true;

    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.textContent = '☰';

    const todoSpan = document.createElement('span');
    todoSpan.textContent = todoText;

    const completeButton = document.createElement('button');
    completeButton.textContent = '完了';
    completeButton.className = 'complete-button';
    completeButton.addEventListener('click', () => {
        toggleCompleted(todoSpan, completeButton);
    });

    const reviveButton = document.createElement('button');
    reviveButton.textContent = '復活';
    reviveButton.className = 'revive-button';
    reviveButton.style.display = 'none';
    reviveButton.addEventListener('click', () => {
        toggleCompleted(todoSpan, reviveButton);
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
    todoItem.appendChild(reviveButton);
    todoItem.appendChild(deleteButton);
    todoList.appendChild(todoItem);

    document.getElementById('new-todo').value = '';
    saveTodos();
    enableDragAndDrop();
}

function addBulkTodos() {
    const bulkText = document.getElementById('bulk-todos').value;
    if (bulkText === '') return;

    const todos = bulkText.split('\n');
    todos.forEach(todoText => {
        if (todoText.trim() !== '') {
            const todoList = document.getElementById('todo-list');
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            todoItem.draggable = true;

            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.textContent = '☰';

            const todoSpan = document.createElement('span');
            todoSpan.textContent = todoText;

            const completeButton = document.createElement('button');
            completeButton.textContent = '完了';
            completeButton.className = 'complete-button';
            completeButton.addEventListener('click', () => {
                toggleCompleted(todoSpan, completeButton);
            });

            const reviveButton = document.createElement('button');
            reviveButton.textContent = '復活';
            reviveButton.className = 'revive-button';
            reviveButton.style.display = 'none';
            reviveButton.addEventListener('click', () => {
                toggleCompleted(todoSpan, reviveButton);
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
            todoItem.appendChild(reviveButton);
            todoItem.appendChild(deleteButton);
            todoList.appendChild(todoItem);
        }
    });

    document.getElementById('bulk-todos').value = '';
    saveTodos();
    enableDragAndDrop();
}

function toggleCompleted(todoSpan, button) {
    const isCompleted = todoSpan.style.textDecoration === 'line-through';
    if (isCompleted) {
        todoSpan.style.textDecoration = '';
        todoSpan.style.color = '';
        button.textContent = '完了';
        button.className = 'complete-button';
        const sibling = button.nextElementSibling;
        if (sibling) sibling.style.display = 'none';
    } else {
        todoSpan.style.textDecoration = 'line-through';
        todoSpan.style.color = 'gray';
        button.textContent = '復活';
        button.className = 'revive-button';
        const sibling = button.nextElementSibling;
        if (sibling) sibling.style.display = 'inline';
        createEmojiEffect(button, '💥');
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
    explosionContainer.appendChild(emojiElement);
    setTimeout(() => emojiElement.remove(), 2000);
}

function completeAllTodos() {
    const todoItems = document.querySelectorAll('.todo-item span');
    const completeButtons = document.querySelectorAll('.complete-button, .revive-button');
    todoItems.forEach((todoSpan, index) => {
        todoSpan.style.textDecoration = 'line-through';
        todoSpan.style.color = 'gray';
        completeButtons[index].textContent = '復活';
        completeButtons[index].className = 'revive-button';
        const sibling = completeButtons[index].nextElementSibling;
        if (sibling) sibling.style.display = 'inline';
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
        const sibling = completeButtons[index].nextElementSibling;
        if (sibling) sibling.style.display = 'none';
    });
    saveTodos();
}

function deleteTodoItem(todoItem) {
    todoItem.remove();
    saveTodos();
}

function saveTodos() {
    const todoItems = document.querySelectorAll('.todo-item span');
    const todos = [];
    todoItems.forEach(todoSpan => {
        todos.push({ text: todoSpan.textContent, completed: todoSpan.style.textDecoration === 'line-through' });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const todoList = document.getElementById('todo-list');
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        todoItem.draggable = true;

        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.textContent = '☰';

        const todoSpan = document.createElement('span');
        todoSpan.textContent = todo.text;
        if (todo.completed) {
            todoSpan.style.textDecoration = 'line-through';
            todoSpan.style.color = 'gray';
        }

        const completeButton = document.createElement('button');
        completeButton.textContent = todo.completed ? '復活' : '完了';
        completeButton.className = todo.completed ? 'revive-button' : 'complete-button';
        completeButton.addEventListener('click', () => {
            toggleCompleted(todoSpan, completeButton);
        });

        const reviveButton = document.createElement('button');
        reviveButton.textContent = '復活';
        reviveButton.className = 'revive-button';
        reviveButton.style.display = todo.completed ? 'inline' : 'none';
        reviveButton.addEventListener('click', () => {
            toggleCompleted(todoSpan, reviveButton);
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
        todoItem.appendChild(reviveButton);
        todoItem.appendChild(deleteButton);
        todoList.appendChild(todoItem);
    });
    enableDragAndDrop();
}

function enableDragAndDrop() {
    const todoList = document.getElementById('todo-list');
    const todoItems = document.querySelectorAll('.todo-item');

    todoItems.forEach(item => {
        const dragHandle = item.querySelector('.drag-handle');
        dragHandle.addEventListener('mousedown', () => {
            item.addEventListener('dragstart', dragStart);
        });
        item.addEventListener('dragend', dragEnd);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', drop);
    });

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => {
            event.target.classList.add('dragging');
        }, 0);
    }

    function dragEnd(event) {
        event.target.classList.remove('dragging');
        saveTodos();
    }

    function dragOver(event) {
        event.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(todoList, event.clientY);
        if (afterElement == null) {
            todoList.appendChild(draggingItem);
        } else {
            todoList.insertBefore(draggingItem, afterElement);
        }
    }

    function drop(event) {
        event.preventDefault();
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}
