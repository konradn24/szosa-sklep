const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const action = params.action;
const success = params.success;
const error = parseInt(params.error);

// On accessing any admin pages module
if(action === 'access') {
    if(error) { 
        showError({ text: `Wystąpił błąd! (${error}: ${errorsPrompts[error]})` }); 
    }
}