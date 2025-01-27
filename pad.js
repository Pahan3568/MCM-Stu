document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const charCountDisplay = document.getElementById('char-count');
    const submitButton = document.getElementById('submit-note');
    const notesList = document.getElementById('notes-list');
    const messageError = document.getElementById('message-error');
    const MAX_NOTES_PER_DAY = 3;

    // Функция для обновления счетчика символов
    function updateCharCount() {
        const remainingChars = 100 - messageInput.value.length;
        charCountDisplay.textContent = remainingChars;
    }

    // Функция для проверки валидности сообщения
    function validateMessage(message) {
        if (message.length < 3) {
            return "Сообщение должно быть не менее 3 символов.";
        }
        return null; // Нет ошибок
    }

    // Функция для получения IP пользователя (используется для симуляции, т.к. реальный IP на клиенте не получить)
    function getClientIP() {
        //  Для простоты симуляции, генерируем уникальный ID на основе времени.
        return 'user_' + Date.now() % 100000; 
        // В реальном проекте, IP нужно получать на стороне сервера.
    }

    // Функция для сохранения записки в файл (симуляция)
    function saveNote(name, message, ip) {
        const now = new Date();
        const dateString = now.toISOString();

        fetch('pad.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}&date=${encodeURIComponent(dateString)}&ip=${encodeURIComponent(ip)}`,
        })
        .then(response => response.text())
        .then(data => {
            if (data === "success") {
                 loadNotes();
                console.log('Заметка успешно сохранена!');
            } else {
                messageError.textContent = "Ошибка при сохранении заметки.";
            }
        })
        .catch(error => {
            console.error('Ошибка при сохранении заметки:', error);
            messageError.textContent = "Ошибка при сохранении заметки.";
        });
    }

    // Функция для загрузки записок из файла (симуляция)
    function loadNotes() {
        fetch('pad.php', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(notes => {
            notesList.innerHTML = ''; // Очищаем предыдущие записки
            notes.forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.classList.add('note');
                noteDiv.innerHTML = `<strong>${note.name}:</strong> ${note.message} <span class="note-date">(${new Date(note.date).toLocaleString()})</span>`;
                notesList.appendChild(noteDiv);
            });
        })
         .catch(error => {
            console.error('Ошибка при загрузке записок:', error);
            notesList.innerHTML = '<p>Ошибка при загрузке записок.</p>';
        });
    }

    // Обработчик ввода сообщения
    messageInput.addEventListener('input', function () {
        updateCharCount();
        messageError.textContent = '';
    });

    // Обработчик отправки формы
    submitButton.addEventListener('click', function () {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        const ip = getClientIP();

        if (!name) {
            messageError.textContent = "Пожалуйста, введите имя.";
            return;
        }

         const messageValidation = validateMessage(message);
         if (messageValidation) {
            messageError.textContent = messageValidation;
            return;
         }


        // Получаем данные о количестве записей от этого IP за сегодня (через PHP)
         fetch('pad.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `check_ip=${encodeURIComponent(ip)}`,
         })
          .then(response => response.json())
          .then(data => {
             const notesCountToday = data.count;

             if (notesCountToday >= MAX_NOTES_PER_DAY) {
                    messageError.textContent = `Вы достигли лимита в ${MAX_NOTES_PER_DAY} записки в день.`;
            } else {
                 saveNote(name, message, ip);
            }
         })
         .catch(error => {
            console.error('Ошибка при проверке IP:', error);
            messageError.textContent = "Ошибка при проверке IP.";
        });


    });


    // Загружаем записки при загрузке страницы
    loadNotes();
    updateCharCount();

});
