const list = document.getElementById("orders-list");

if(!list) {
    throw new Error("Cannot load orders list.");
}

const userFilter = document.getElementById("user-filter");
const dateFilter = document.getElementById("date-filter");
const paymentFilter = document.getElementById("payment-filter");
const completedFilter = document.getElementById("completed-filter");

if(!userFilter || !dateFilter || !paymentFilter || !completedFilter) {
    throw new Error("Cannot load orders list filter controls.");
}

document.addEventListener('DOMContentLoaded', () => {
    userFilter.onchange = refresh;
    dateFilter.onchange = refresh;
    paymentFilter.onchange = refresh;
    completedFilter.onchange = refresh;

    const params = new URLSearchParams(window.location.search);

    if(params.user) {
        userFilter.value = params.user;
    }

    refresh();
});

function refresh() {
    const filteredOrders = orders.filter(order => {
        if(userFilter.value) {
            if(userFilter.value === 'no-account' && order.userId) {
                return false;
            }

            const userId = parseInt(userFilter.value);

            if(!isNaN(userId) && order.userId !== userId) {
                return false;
            }
        }

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
        const data = deliveriesData.find(e => e.orderId === order.id);

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
                <div class="item-title"><i class="icon-basket"></i> Zamówienie #${order.id} (${(Math.round(order.price * 100) / 100).toFixed(2)} PLN) - ${data ? data.email : '???'}</div>
                <div class="item-property">${new Date(order.date).toLocaleString('pl-PL')} &nbsp; ${payment} ${completed}</div>
            </div>

            <ul class="item-actions">
                <li><a href="/zarzadzanie-sklepem/zamowienia/szczegoly?id=${order.id}"><i class="icon-menu"></i></a></li>
                ${order.paymentMade ? '' : htmlActionPayment}
                ${order.completed ? '' : htmlActionCompleted}
            </ul>
        `;

        list.appendChild(item);
    }
}

const htmlActionPayment = `<li><a href="javascript:{}" onclick="showSetPaymentForm()" style="color: green;"><i class="icon-credit-card"></i></a></li>`;
const htmlActionCompleted = `<li><a href="javascript:{}" onclick="showSetCompletedForm()" style="color: green;"><i class="icon-ok"></i></a></li>`;