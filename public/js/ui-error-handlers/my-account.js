const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On accessing order
if(action === 'access') {
    switch(error) {
        case errors.notFound: { showError({ text: "Nie znaleziono zamówienia!" }); break; }
        default:              { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

// On password change
checkResult: if(action === 'change-password') {
    if(success) {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: `Hasło zostało zaktualizowane.` });
        break checkResult;
    }

    switch(error) {
        case errors.invalidData: { showError({ text: "Podane hasła nie są identyczne!" }); break; }
        default:                 { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}