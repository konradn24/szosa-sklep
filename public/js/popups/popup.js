const popupOverlay = document.getElementById('popup-overlay');
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popup-close');
const popupTitle = document.getElementById('popup-title');
const popupText = document.getElementById('popup-text');

function openPopup() {
    popupOverlay.style.display = 'block';
}

function closePopup() {
    popupOverlay.style.display = 'none';
}

function showInfo({ title, text }) {
    popupTitle.innerHTML = title;
    popupText.innerHTML = text;
    openPopup();
}

function showWarning({ text }) {
    popupTitle.innerHTML = '<i class="icon-attention" style="color: #b57a14;"></i>' + (pl ? 'Ostrzeżenie' : 'Warning');
    popupText.innerHTML = text;
    openPopup();
}

function showError({ text }) {
    popupTitle.innerHTML = '<i class="icon-cancel-circled" style="color: red;"></i>' + (pl ? 'Błąd' : 'Error');
    popupText.innerHTML = text;
    openPopup();
}

popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', function (event) {
    if (event.target === popupOverlay) {
        closePopup();
    }
});

const nullElementsCount = [popupOverlay, popup, popupClose, popupTitle, popupText].map(element => {
    if(!element) return element;
}).length;


console.log("Initialized popup.js: OK.");