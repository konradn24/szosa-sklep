const nameInput = document.getElementById('name');
const uriInput = document.getElementById('url');

let uriChangedByUser = false;

nameInput.oninput = () => {
    if(uriChangedByUser) {
        return;
    }

    const uri = nameInput.value.trim().replaceAll(' ', '-').toLowerCase();
    uriInput.value = uri;
}

uriInput.oninput = () => {
    if(uriInput.value === '') {
        uriChangedByUser = false;
    } else {
        uriChangedByUser = true;
    }
}