const cardInput = document.getElementById('card');
const cardInfo = document.getElementById('card-info');
const submitButton = document.getElementById('submit');

cardInput.oninput = () => {
    const numberRegex = /^\d+$/;
    const value = cardInput.value.replace(/\s+/g, '');

    if(value.length !== 16 || !numberRegex.test(value)) {
        cardInput.style.border = '1px solid red';
        cardInfo.style.display = 'block';
        submitButton.disabled = true;
    } else {
        cardInput.style.border = '1px solid black';
        cardInfo.style.display = 'none';
        submitButton.disabled = false;
    }
};