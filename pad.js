document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const submitButton = document.getElementById('submit-note');
    const messageError = document.getElementById('message-error');
    const notesList = document.getElementById('notes-list');

    const maxChars = 100;
    let dailyPosts = {};

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

    // Функция для загрузки заметок из локального хранилища (эмуляция)
    function loadNotes() {
      const storedNotes = localStorage.getItem('notes');
      if (storedNotes){
        try {
          const notes = JSON.parse(storedNotes);
          notes.forEach(addNoteToUI);
          return notes;
          } catch (e) {
            console.error("Ошибка при разборе заметок из localStorage", e);
            return [];
          }
      }
      return [];
    }

    // Функция для сохранения заметок в локальное хранилище (эмуляция)
    function saveNotes(notes) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
     // Функция для добавления заметки в пользовательский интерфейс
     function addNoteToUI(note){
      const noteItem = document.createElement('div');
      noteItem.classList.add('note-item');
      noteItem.innerHTML = `<strong>${note.name}:</strong> ${note.message}`;
      notesList.appendChild(noteItem);
     }

    // Функция для публикации заметки
    function publishNote() {
       const name = nameInput.value.trim();
       const message = messageInput.value.trim();
       messageError.textContent = '';

       if (name.length < 1){
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

        const note = {name, message};
        const notes = loadNotes();
        notes.push(note);
        saveNotes(notes);
        addNoteToUI(note);

        dailyPosts[ip][today]++;
        nameInput.value = "";
        messageInput.value = "";
        updateCharCount();
    }
    // Загрузка заметок при загрузке страницы
    loadNotes();

    submitButton.addEventListener('click', publishNote);
});
