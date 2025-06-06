const nameInput = document.getElementById('name');
const uriInput = document.getElementById('url');
const categoryInput = document.getElementById('category');
const priceInput = document.getElementById('price');
const amountInput = document.getElementById('amount');
const form = document.getElementById('form');
const submitButton = document.getElementById('submit-button');

const uriInfo = document.getElementById('url-info');

let uriChangedByUser = false;

nameInput.oninput = () => {
    allowInput(nameInput);

    if(uriChangedByUser) {
        return;
    }

    const uri = nameInput.value.trim().replaceAll(' ', '-').toLowerCase();
    uriInput.value = uri;

    if(productsUrl.includes(uriInput.value)) {
        denyInput(uriInput);
        showInfo(uriInfo, '<i class="icon-attention"></i> Ten adres URL jest już zajęty!');
    } else {
        allowInput(uriInput);
        hideInfo(uriInfo);
    }
}

uriInput.oninput = () => {
    if(productsUrl.includes(uriInput.value)) {
        denyInput(uriInput);
        showInfo(uriInfo, '<i class="icon-attention"></i> Ten adres URL jest już zajęty!');
    } else {
        allowInput(uriInput);
        hideInfo(uriInfo);
    }

    if(uriInput.value === '') {
        uriChangedByUser = false;
    } else {
        uriChangedByUser = true;
    }
}

categoryInput.oninput = () => {
    allowInput(categoryInput);
}

priceInput.oninput = () => {
    allowInput(priceInput);
}

amountInput.oninput = () => {
    allowInput(amountInput);
}

submitButton.onclick = () => {
    validateForm();
} 

function validateForm() {
    let filled = true;

    if(!nameInput.value.replace(/\s+/g, '')) {
        denyInput(nameInput);
        filled = false;
    }

    if(!uriInput.value.replace(/\s+/g, '')) {
        denyInput(uriInput);
        filled = false;
    }

    if(!categoryInput.value) {
        denyInput(categoryInput);
        filled = false;
    }

    if(!priceInput.value) {
        denyInput(priceInput);
        filled = false;
    }

    if(!amountInput.value) {
        denyInput(amountInput);
        filled = false;
    }

    if(productsUrl.includes(uriInput.value)) {
        denyInput(uriInput);
        showInfo(uriInfo, '<i class="icon-attention"></i> Ten adres URL jest już zajęty!');

        filled = false;
    }

    if(!filled) {
        return false;
    }

    form.submit();
}

function allowInput(inputElement) {
    inputElement.style.border = '1px solid #000';
}

function denyInput(inputElement) {
    inputElement.style.border = '1px solid red';
}

function showInfo(element, html) {
    element.classList.remove('display-none');
    element.innerHTML = html;
}

function hideInfo(element) {
    element.classList.add('display-none');
}