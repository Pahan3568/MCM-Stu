document.addEventListener('DOMContentLoaded', () => {
    const targetDate = new Date('2025-03-01T18:00:00+03:00'); // 18:00 по московскому времени (UTC+3)
    console.log("Целевая дата:", targetDate);

    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error("Один или несколько элементов таймера не найдены.");
        return;
    }
    let timerInterval;
    function updateTimer() {
        const now = new Date();
        console.log("Текущее время:", now)
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            clearInterval(timerInterval);
            console.log("Время истекло!");
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        updateValue(daysElement, days);
        updateValue(hoursElement, hours);
        updateValue(minutesElement, minutes);
        updateValue(secondsElement, seconds);

        console.log("Осталось:", days, "дней", hours, "часов", minutes, "минут", seconds, "секунд");
    }

    function updateValue(element, newValue) {
        const oldValue = element.textContent;
        if (newValue !== parseInt(oldValue, 10)) {
            element.classList.add('changed');
            element.textContent = String(newValue).padStart(2, '0');
            setTimeout(() => element.classList.remove('changed'), 300);
        }
    }


    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    console.log("Идентификатор интервала:", timerInterval);
});

