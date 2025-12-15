let AdminService = {

    initializeOrdersTable: function () {
        // Removed the debug console log
        const token = localStorage.getItem('user_token');
        console.log("Token:", token);

        fetch('http://localhost/web/backend/admin/orders', {
            headers: {
                'Authentication': token
            }
        })
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#ordersTable tbody');
                tbody.innerHTML = '';

                data.forEach(order => {


                    console.log(order);

                    const row = document.createElement('tr');

                    row.className = 'mt-4';

                    row.innerHTML = `
                    <td>
                        <span class="font-monospace">${order.orders_id || order.order_id}</span>
                    </td>
                    <td>${order.orders_user_id}</td>
                    <td>${order.books_title}</td>
                    <td class="fw-bold">$${parseFloat(order.orders_total_amount).toFixed(2)}</td>
                `;

                    tbody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }
}