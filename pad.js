document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const submitButton = document.getElementById('submit-note');
    const messageError = document.getElementById('message-error');
    const notesList = document.getElementById('notes-list');

    const maxChars = 100;
    let dailyPosts = {};
    const DATA_FILE = 'pad.txt'; // Путь к файлу

    // Функция для обновления счетчика символов
    function updateCharCount() {
        const remainingChars = maxChars - messageInput.value.length;
        charCount.textContent = remainingChars;
        charCount.style.color = remainingChars < 0 ? 'red' : '#555';
    }

    messageInput.addEventListener('input', updateCharCount);

    // Функция для получения IP-адреса (эмуляция)
    function getIpAddress() {
         // Генерация уникального идентификатора пользователя (замените на реальное определение IP-адреса)
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Функция для загрузки заметок из файла
    async function loadNotes() {
        try {
          const response = await fetch(DATA_FILE);
          if (!response.ok) {
             if (response.status === 404) {
                // Если файла нет, создаем пустой файл
                console.log("Файл pad.txt не найден. Создаю пустой файл.")
                 await fetch(DATA_FILE, {
                      method: 'PUT'
                 })
                 return [];
              } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
               }
          }
            const text = await response.text();
            if (!text.trim()) return [];
            const notes = text.split('\n').map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                console.error('Ошибка при парсинге JSON', e);
                  return null;
              }
              }).filter(note => note); // Фильтрация null
             notes.forEach(note => addNoteToUI(note, false));
          } catch (e) {
              console.error('Ошибка при загрузке заметок', e);
             messageError.textContent = 'Ошибка при загрузке заметок';
           }

    }
   // Функция для добавления заметки в пользовательский интерфейс
   function addNoteToUI(note, isNew = true) {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        const sentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
        if (isNew) { // Если это новая заметка, используем name и message
          noteItem.innerHTML = `<strong>${note.name}:</strong> ${note.message} <span style="float:right;">(${sentTime})</span>`;
        } else { // Если заметка загружена из файла, используем title и body
           noteItem.innerHTML = `<strong>${note.name}:</strong> ${note.message} <span style="float:right;">(${sentTime})</span>`;
        }
        notesList.appendChild(noteItem);
   }

    // Функция для сохранения заметок в файл
    async function saveNote(note) {
         try {
            const response = await fetch(DATA_FILE, {
                 method: 'POST',
                 body: JSON.stringify(note) + '\n',
                 headers: {
                     'Content-Type': 'text/plain; charset=UTF-8',
                }
            });

           if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

       } catch (e) {
         console.error("Ошибка при сохранении заметки", e);
           messageError.textContent = 'Ошибка при сохранении заметки';
       }
    }

     // Функция для публикации заметки
    async function publishNote() {
          const name = nameInput.value.trim();
          const message = messageInput.value.trim();
          messageError.textContent = '';
           if (name.length < 1) {
              messageError.textContent = 'Имя должно быть заполнено';
             return;
           }
          if (message.length < 3) {
               messageError.textContent = 'Сообщение должно содержать минимум 3 символа';
              return;
           }
         if (message.length > maxChars) {
             messageError.textContent = `Сообщение не может содержать больше ${maxChars} символов`;
             return;
        }
         const ip = getIpAddress();
         const today = new Date().toLocaleDateString();
         if (!dailyPosts[ip]) {
            dailyPosts[ip] = {};
        }
        if (!dailyPosts[ip][today]){
           dailyPosts[ip][today] = 0;
        }
        if (dailyPosts[ip][today] >= 3) {
            messageError.textContent = 'Вы уже опубликовали 3 сообщения сегодня.';
           return;
       }

        const note = { name: name, message: message, time: new Date().toISOString() };
         try {
              await saveNote(note);
               addNoteToUI(note, true);
              dailyPosts[ip][today]++;
              nameInput.value = "";
              messageInput.value = "";
              updateCharCount();
         } catch (e) {
            console.error('Ошибка при отправке заметки', e);
           messageError.textContent = 'Ошибка при отправке заметки';
      }
    }

    loadNotes();

    submitButton.addEventListener('click', publishNote);
});                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Преобразование в JSON")
            const notes = await response.json();
            console.log("Заметки:", notes);
            notes.forEach(note => addNoteToUI(note));
        } catch (e) {
            console.error('Ошибка при загрузке заметок', e);
            messageError.textContent = 'Ошибка при загрузке заметок';
        }
    }

    // Функция для добавления заметки в пользовательский интерфейс
    function addNoteToUI(note) {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        const sentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
        noteItem.innerHTML = `<strong>${note.title}:</strong> ${note.body} <span style="float:right;">(${sentTime})</span>`;
        notesList.appendChild(noteItem);
    }

    // Функция для публикации заметки
    async function publishNote() {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        messageError.textContent = '';
        if (name.length < 1) {
            messageError.textContent = 'Имя должно быть заполнено';
            return;
        }
        if (message.length < 3) {
            messageError.textContent = 'Сообщение должно содержать минимум 3 символа';
            return;
        }
        if (message.length > maxChars) {
            messageError.textContent = `Сообщение не может содержать больше ${maxChars} символов`;
            return;
        }
        const ip = getIpAddress();
        const today = new Date().toLocaleDateString();
        if (!dailyPosts[ip]) {
            dailyPosts[ip] = {};
        }
        if (!dailyPosts[ip][today]){
            dailyPosts[ip][today] = 0;
        }
        if (dailyPosts[ip][today] >= 3) {
            messageError.textContent = 'Вы уже опубликовали 3 сообщения сегодня.';
            return;
        }
        const note = {title: name, body: message}; // Изменили структуру заметки

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(note),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            console.log('Заметка успешно добавлена на сервер:', json);
            addNoteToUI(note); // Используем новую структуру
            dailyPosts[ip][today]++;
            nameInput.value = "";
            messageInput.value = "";
            updateCharCount();
        } catch (e) {
            console.error('Ошибка при отправке заметки', e);
            messageError.textContent = 'Ошибка при отправке заметки';
        }
    }

    loadNotes();

    submitButton.addEventListener('click', publishNote);
});
