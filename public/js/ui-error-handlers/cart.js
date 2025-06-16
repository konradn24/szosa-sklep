const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On modifying cart
checkResult: if(action === 'modify') {
    if(success) {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: `Zmodyfikowano ilość produktu w koszyku na: ${success}.` });
        break checkResult;
    }

    switch(error) {
        case errors.invalidData: { showError({ text: "Przekroczono dostępną ilość produktu w magazynie!" }); break; }
        default:                 { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

// On removing product from cart
checkResult: if(action === 'remove') {
    if(success === 'true') {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: "Usunięto produkt z koszyka." });
        break checkResult;
    }

    switch(error) {
        case errors.notFound: { showError({ text: "Nie znaleziono produktu do usunięcia!" }); break; }
        default:              { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
    }
}

// On clearing cart
checkResult: if(action === 'clear') {
    if(success === 'true') {
        showInfo({ title: '<i class="icon-ok-circled" style="color: green;"></i> Sukces', text: "Wyczyszczono koszyk." });
        break checkResult;
    }

    if(error) {
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` });
    }
}

// On accessing order page
checkResult: if(action === 'access') {
    if(error) {
        switch (error) {
            case errors.badRequest: { showError({ text: "Nie można przejść do zamówienia - koszyk jest pusty!" }); break; }
            default:                { showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); break; }
        }
    }
}