const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On auth error
if(error) {
    switch(error) {
        case errors.unauthorized:  { showErrorElement(); break; }
        default:                   { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

function showErrorElement() {
    document.getElementById('error').style.display = 'block';
}