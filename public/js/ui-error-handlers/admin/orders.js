const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On accessing order details
if(action === 'access') {
    if(error) { 
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}

// On editing order status
if(action === 'edit') {
    if(success === 'true') {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: 'Status zamówienia został zaktualizowany.' });
    }

    if(error) { 
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}

// Custom set payment warning
function showSetPaymentForm(element, id) {
    const html = `
        Czy chcesz oznaczyć zamówienie <b>#${id}</b> jako opłacone?
        <form method="post" action="/zarzadzanie-sklepem/zamowienia/edytuj?id=${id}&payment=true">
            <div class="row" style="justify-content: center; margin-top: 2rem; gap: 2rem;">
                <button type="button" onclick="closePopup()" class="button-red"><i class="icon-cancel"></i> Anuluj</button>
                <button type="submit" class="button-green"><i class="icon-ok"></i> Potwierdź</button>
            </div>
        </form>
    `;

    showWarning({ text: html });
}

// Custom set completed warning
function showSetCompletedForm(element, id) {
    const html = `
        Czy chcesz oznaczyć zamówienie <b>#${id}</b> jako wykonane? 
        Jeżeli zamówienie nie jest oznaczone jako opłacone, płatność zostanie automatycznie potwierdzona.
        <form method="post" action="/zarzadzanie-sklepem/zamowienia/edytuj?id=${id}&completed=true">
            <div class="row" style="justify-content: center; margin-top: 2rem; gap: 2rem;">
                <button type="button" onclick="closePopup()" class="button-red"><i class="icon-cancel"></i> Anuluj</button>
                <button type="submit" class="button-green"><i class="icon-ok"></i> Potwierdź</button>
            </div>
        </form>
    `;

    showWarning({ text: html });
}