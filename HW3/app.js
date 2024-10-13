const apiKey = 'BDB9F4VyUetW20qQeidgUwqyFKPSlyXQ8MQwj-4Ifys';
const photoElement = document.getElementById('photo');
const photographerElement = document.getElementById('photographer');
const likeButton = document.getElementById('likeButton');
const likeCountElement = document.getElementById('likeCount');
const viewHistoryButton = document.getElementById('viewHistoryButton');
const historyListElement = document.getElementById('historyList');

let currentImageUrl = '';
let likeData = JSON.parse(localStorage.getItem('likeData')) || {};
let viewHistory = JSON.parse(localStorage.getItem('viewHistory')) || [];

async function fetchRandomImage() {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${apiKey}`);
    const data = await response.json();
    currentImageUrl = data.urls.regular;
    photoElement.src = currentImageUrl;
    photographerElement.textContent = `Фотограф: ${data.user.name}`;

    updateLikeCount(currentImageUrl);

    viewHistory.push({ url: currentImageUrl, photographer: data.user.name });
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
}

function updateLikeCount(imageUrl) {
    if (likeData[imageUrl]) {
        likeCountElement.textContent = likeData[imageUrl].count;
    } else {
        likeCountElement.textContent = 0;
    }
}

likeButton.addEventListener('click', () => {
    if (!likeData[currentImageUrl]) {
        likeData[currentImageUrl] = {
            count: 0,
            firstLikeTime: new Date().toISOString()
        };
    }

    likeData[currentImageUrl].count++;
    likeCountElement.textContent = likeData[currentImageUrl].count;
    localStorage.setItem('likeData', JSON.stringify(likeData));
});

viewHistoryButton.addEventListener('click', () => {
    historyListElement.innerHTML = '';
    viewHistory.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `Фотограф: ${item.photographer}`;
        link.addEventListener('click', () => {
            photoElement.src = item.url;
            photographerElement.textContent = `Фотограф: ${item.photographer}`;
            currentImageUrl = item.url;
            updateLikeCount(item.url); // Обновляем количество лайков для выбранного изображения
        });
        listItem.appendChild(link);
        historyListElement.appendChild(listItem);
    });
});

fetchRandomImage();
