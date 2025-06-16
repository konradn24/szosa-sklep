const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On adding product to cart
checkResult: if(action === 'cart-add') {
    if(success) {
        showCartAddInfo();
        break checkResult;
    }

    switch(error) {
        case errors.notFound:    { showError({ text: "Nie znaleziono takiego produktu!" }); break; }
        case errors.invalidData: { showError({ text: "Przekroczono dostępną ilość produktu w magazynie!" }); break; }
        default:                 { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

// Custom info box text
function showCartAddInfo() {
    const html = `Dodano ${success} ${parseInt(success) === 1 ? 'produkt' : 'produktów'} do koszyka.
        <div class="row-space-evenly" style="margin-top: 2rem; gap: 2rem;">
            <button onclick="closePopup()">Kontynuuj zakupy</button>
            <a href="/koszyk"><button><i class="icon-basket"></i> Zobacz koszyk</button></a>
        </div>
    `;

    showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: html });
}