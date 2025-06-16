const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On accessing product page
if(action === 'access') {
    switch(error) {
        case errors.notFound: { showError({ text: "Nie znaleziono produktu!" }); break; }
        default:              { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}