 let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let currentFilter = 'all';

        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        
        function renderTasks() {
            const list = document.getElementById('taskList');
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            list.innerHTML = '';

            tasks
                .filter(task => {
                    if (currentFilter === 'active') return !task.completed;
                    if (currentFilter === 'completed') return task.completed;
                    return true;
                })
                .filter(task => task.text.toLowerCase().includes(searchTerm))
                .forEach((task, index) => {
                    const li = document.createElement('li');
                    li.className = `task ${task.completed ? 'completed' : ''}`;

                    const left = document.createElement('div');
                    left.className = 'left';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.completed;
                    checkbox.onchange = () => toggleComplete(index);
                    left.appendChild(checkbox);

                    const textSpan = document.createElement('span');
                    textSpan.textContent = task.text;
                    textSpan.ondblclick = () => editTask(index, textSpan);
                    left.appendChild(textSpan);

                    const priority = document.createElement('span');
                    priority.className = `priority-tag ${task.priority}`;
                    priority.textContent = task.priority;
                    left.appendChild(priority);

                    const actions = document.createElement('div');
                    actions.className = 'actions';

                    const delBtn = document.createElement('button');
                    delBtn.textContent = 'Delete';
                    delBtn.onclick = () => deleteTask(index);
                    actions.appendChild(delBtn);

                    li.appendChild(left);
                    li.appendChild(actions);

                    list.appendChild(li);
                });
        }

        function addTask() {
            const input = document.getElementById('taskInput');
            const priority = document.getElementById('prioritySelect').value;
            const text = input.value.trim();
            if (!text) return;

            tasks.push({ text, completed: false, priority });
            input.value = '';
            saveTasks();
            renderTasks();
        }

        function toggleComplete(index) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        }

        function deleteTask(index) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }

        function clearCompleted() {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        }

        function setFilter(filter) {
            currentFilter = filter;
            renderTasks();
        }

        function toggleDarkMode() {
            const body = document.body;
            const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', theme);
        }

        function editTask(index, textSpan) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = tasks[index].text;
            input.className = 'edit-input';

            input.onblur = () => {
                tasks[index].text = input.value.trim();
                saveTasks();
                renderTasks();
            };

            input.onkeydown = (e) => {
                if (e.key === 'Enter') input.blur();
            };

            textSpan.replaceWith(input);
            input.focus();
        }

        document.getElementById('searchInput').addEventListener('input', renderTasks);

        renderTasks();