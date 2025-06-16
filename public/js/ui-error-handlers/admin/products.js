const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On accessing edit page
if(action === 'access') {
    if(error) {
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}

// On adding product
if(action === 'add') {
    if(success === 'true') {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: 'Produkt został utworzony.' });
    }

    if(error) { 
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}

// On editing product
if(action === 'edit') {
    if(success === 'true') {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: 'Produkt został zmodyfikowany.' });
    }

    if(error) { 
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}

// On deleting product
if(action === 'delete') {
    if(success === 'true') {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: 'Produkt został usunięty.' });
    }

    if(error) { 
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}

// Custom delete product warning
function showDeleteProductForm(element, id, name) {
    const html = `
        Czy chcesz usunąć product <b>${name}</b>? Nie można cofnąć tej operacji.
        <form method="post" action="/zarzadzanie-sklepem/produkty/usun?id=${id}">
            <div class="row" style="justify-content: center; margin-top: 2rem; gap: 2rem;">
                <button type="button" onclick="closePopup()" class="button-red"><i class="icon-cancel"></i> Anuluj</button>
                <button type="submit" class="button-green"><i class="icon-ok"></i> Potwierdź</button>
            </div>
        </form>
    `;

    showWarning({ text: html });
}