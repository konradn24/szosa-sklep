const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On setting admin
if(action === 'set-admin') {
    if(success === 'true') {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: 'Uprawnienia zostały zaktualizowane.' });
    }

    if(error) { 
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}

// Custom adding admin warning
function showAddAdminForm(element, id, username) {
    const html = `
        Czy chcesz udzielić uprawnień administratora dla <b>${username}</b>? 
        Spowoduje to możliwość pełnej kontroli sklepu przez tego użytkownika.
        <form method="post" action="/zarzadzanie-sklepem/konta-klientow/edytuj?id=${id}&admin=true">
            <div class="row" style="justify-content: center; margin-top: 2rem; gap: 2rem;">
                <button type="button" onclick="closePopup()" class="button-red"><i class="icon-cancel"></i> Anuluj</button>
                <button type="submit" class="button-green"><i class="icon-ok"></i> Potwierdź</button>
            </div>
        </form>
    `;

    showWarning({ text: html });
}

// Custom deleting admin warning
function showDeleteAdminForm(element, id, username) {
    const html = `
        Czy chcesz odebrać uprawnienia administratora użytkownikowi <b>${username}</b>?
        <form method="post" action="/zarzadzanie-sklepem/konta-klientow/edytuj?id=${id}&admin=false">
            <div class="row" style="justify-content: center; margin-top: 2rem; gap: 2rem;">
                <button type="button" onclick="closePopup()" class="button-red"><i class="icon-cancel"></i> Anuluj</button>
                <button type="submit" class="button-green"><i class="icon-ok"></i> Potwierdź</button>
            </div>
        </form>
    `;

    showWarning({ text: html });
}