document.addEventListener('DOMContentLoaded', () => {
    const targetDate = new Date('2024-03-01T18:00:00+03:00'); // 18:00 по московскому времени (UTC+3)

    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            clearInterval(timerInterval); // Остановить таймер, если время истекло
            return;
        }

        const days = Math.floor(timeLeft / (1000 × 60 × 60 * 24));
        const hours = Math.floor((timeLeft % (1000 × 60 × 60 * 24)) / (1000 × 60 × 60));
        const minutes = Math.floor((timeLeft % (1000 × 60 × 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        updateValue(daysElement, days);
        updateValue(hoursElement, hours);
        updateValue(minutesElement, minutes);
        updateValue(secondsElement, seconds);
    }

    function updateValue(element, newValue) {
        const oldValue = element.textContent;
        if (newValue !== parseInt(oldValue, 10)) { // Проверка на отличие значения
            element.classList.add('changed'); // Добавить класс для анимации
            element.textContent = String(newValue).padStart(2, '0'); // Обновить значение
            setTimeout(() => element.classList.remove('changed'), 300); // Удалить класс после анимации
        }
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000); // Обновление каждую секунду
});
