const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On accessing summary page
if(action === 'access') {
    switch(error) {
        case errors.invalidData: { showError({ text: "Podano nieprawidłowe dane (sprawdź login oraz numer karty)!" }); break; }
        case errors.badRequest:  { showError({ text: `Wystąpił błąd! Być może brakuje któregoś z produktów w magazynie (${error}: ${errorsPrompts[error]})` }); break; }
        default:                 { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

// Legal alert
if(!localStorage.getItem('order-warned')) {
    showWarning({ text: "UWAGA: Ta strona to tylko projekt w celach edukacyjnych! Proszę nie podawać swoich prawdziwych danych." });
    localStorage.setItem('order-warned', true);
}