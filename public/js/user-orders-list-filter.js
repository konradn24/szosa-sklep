const list = document.getElementById("orders-list");

if(!list) {
    throw new Error("Cannot load orders list.");
}

const dateFilter = document.getElementById("date-filter");
const paymentFilter = document.getElementById("payment-filter");
const completedFilter = document.getElementById("completed-filter");

if(!dateFilter || !paymentFilter || !completedFilter) {
    throw new Error("Cannot load orders list filter controls.");
}

document.addEventListener('DOMContentLoaded', () => {
    dateFilter.onchange = refresh;
    paymentFilter.onchange = refresh;
    completedFilter.onchange = refresh;

    refresh();
});

function refresh() {
    const filteredOrders = orders.filter(order => {
        if(dateFilter.value) {
            const date = new Date(dateFilter.value);
            const orderDate = new Date(order.date);

            if(orderDate.getFullYear() !== date.getFullYear() || orderDate.getMonth() !== date.getMonth() || orderDate.getDate() !== date.getDate()) {
                return false;
            }
        }

        if(paymentFilter.value && order.paymentMade !== (paymentFilter.value === 'true')) {
            return false;
        }

        if(completedFilter.value && order.completed !== (completedFilter.value === 'true')) {
            return false;
        }

        return true;
    });

    list.replaceChildren();

    for(const order of filteredOrders) {
        const item = document.createElement('div');
        item.classList.add('row-space-between');

        const payment = order.paymentMade ? 
            '<span style="color: green;">(płatność: <i class="icon-ok-circled"></i>)</span>' :
            '<span style="color: red;">(płatność: <i class="icon-cancel-circled"></i>)</span>';
        
        const completed = order.completed ? 
            '<span style="color: green;">(zrealizowane: <i class="icon-ok-circled"></i>)</span>' :
            '<span style="color: red;">(zrealizowane: <i class="icon-cancel-circled"></i>)</span>';

        item.innerHTML = `
            <div>
                <div class="item-title"><i class="icon-basket"></i> Zamówienie #${order.id} (${(Math.round(order.price * 100) / 100).toFixed(2)} PLN)</div>
                <div class="item-property">${new Date(order.date).toLocaleString('pl-PL')} &nbsp; ${payment} ${completed}</div>
            </div>

            <ul class="item-actions">
                <li><a href="/moje-konto/zamowienie?id=${order.id}"><i class="icon-menu"></i></a></li>
            </ul>
        `;

        list.appendChild(item);
    }
}