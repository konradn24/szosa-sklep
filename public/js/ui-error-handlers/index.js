const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On accessing product, admin, account or non-user order page
if(action === 'access') {
    switch(error) {
        case errors.forbidden: { showError({ text: "Brak uprawnień do wyświetlenia tej strony!" }); break; }
        default:               { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

// On logged in
if(action === 'login') {
    if(success) {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: `Zalogowano jako <b>${decodeURIComponent(success)}</b>.` });
    } else {
        const mail = params.mail === 'true';

        if(mail) {
            showInfo({ 
                title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', 
                text: "Dziękujemy za rejestrację! Sprawdź skrzynkę E-mail, aby potwierdzić swój adres." 
            });
        } else {
            showWarning({ text: "Dziękujemy za rejestrację! Nie udało się wysłać E-mail'a w celu potwierdzenia twojego adresu." });
        }
    }
}

// On logged out
if(action === 'logout') {
    showInfo({
        title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', 
        text: success !== 'undefined' ? `Zostałeś wylogowany z konta <b>${decodeURIComponent(success)}</b>.` : 'Zostałeś wylogowany.' 
    });
}

// On verified
checkResult: if(action === 'verify') {
    if(success) {
        showInfo({
            title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', 
            text: success !== 'undefined' ? `Adres <b>${decodeURIComponent(success)}</b> został zweryfikowany.` : 'Adres E-mail został zweryfikowany.' 
        });

        break checkResult;
    }

    switch(error) {
        case errors.notFound: { showError({ text: "Nieprawidłowy kod weryfikacyjny." }); break; }
        default:              { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

// Legal alert
if(!localStorage.getItem('warned')) {
    showWarning({ text: "UWAGA: Ta strona to tylko projekt w celach edukacyjnych! Proszę nie podawać swoich prawdziwych danych." });
    localStorage.setItem('warned', true);
}