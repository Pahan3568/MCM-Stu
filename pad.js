document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const submitButton = document.getElementById('submit-note');
    const messageError = document.getElementById('message-error');
    const notesList = document.getElementById('notes-list');

    const maxChars = 100;
    let dailyPosts = {};
    const API_URL = "https://jsonplaceholder.typicode.com/posts"; // URL для JSONPlaceholder


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


    // Функция для загрузки заметок с сервера
  async function loadNotes() {
       try{
           const response = await fetch(`${API_URL}?_limit=20`);
           if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
           }
           const notes = await response.json();
           notes.forEach(note => addNoteToUI(note));
        }
           catch (e){
               console.error('Ошибка при загрузке заметок', e);
              messageError.textContent = 'Ошибка при загрузке заметок';
           }

        }

    // Функция для добавления заметки в пользовательский интерфейс
      function addNoteToUI(note) {
           const noteItem = document.createElement('div');
           noteItem.classList.add('note-item');
           // Преобразование времени в формат HH:MM:SS
           const sentTime = new Date(note.time);
           const timeString = sentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          noteItem.innerHTML = `<strong>${note.name}:</strong> ${note.message} <span style="float:right;">(${timeString})</span>`;
          notesList.appendChild(noteItem);
      }


     // Функция для публикации заметки
     async function publishNote() {
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

       const note = {name, message, time: new Date().toISOString()};


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

                addNoteToUI(note);
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
