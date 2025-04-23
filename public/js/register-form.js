const nameInput = document.getElementById('name');
const loginInput = document.getElementById('login');
const password1Input = document.getElementById('password1');
const password2Input = document.getElementById('password2');
const submitButton = document.getElementById('submit');

const nameInfo = document.getElementById('name-info');
const loginInfo = document.getElementById('login-info');
const passwordInfo = document.getElementById('password-info');

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function allowForm(inputElement) {
    inputElement.style.border = '1px solid #000';
    submitButton.disabled = false;
}

function denyForm(inputElement) {
    inputElement.style.border = '1px solid red';
    submitButton.disabled = true;
}

function showInfo(element, html) {
    element.classList.remove('display-none');
    element.innerHTML = html;
}

function hideInfo(element) {
    element.classList.add('display-none');
}

nameInput.oninput = async () => {
    const value = await sha256(nameInput.value);
    const user = users.find(e => e.name === value);

    if(user) {
        denyForm(nameInput);
        showInfo(nameInfo, '<i class="icon-attention"></i> Ta nazwa użytkownika jest już zajęta!');
    } else {
        allowForm(nameInput);
        hideInfo(nameInfo);
    }
};

loginInput.oninput = async () => {
    const value = await sha256(loginInput.value);
    const user = users.find(e => e.login === value);

    if(user) {
        denyForm(loginInput);
        showInfo(loginInfo, '<i class="icon-attention"></i> Ten login jest już zajęty!');
    } else {
        allowForm(loginInput);
        hideInfo(loginInfo);
    }
};

const checkPasswords = () => {
    const value1 = password1Input.value;
    const value2 = password2Input.value;

    if(value1 !== value2) {
        denyForm(password1Input);
        denyForm(password2Input);
        showInfo(passwordInfo, '<i class="icon-attention"></i> Hasła nie są identyczne!');
    } else {
        allowForm(password1Input);
        allowForm(password2Input);
        hideInfo(passwordInfo);
    }
};

password1Input.oninput = checkPasswords;
password2Input.oninput = checkPasswords;

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}