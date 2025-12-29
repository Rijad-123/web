let AdminService = {

    // 1. Fetch and Render Total Stats (Orders & Revenue)
    initializeTotalStats: function () {
        const token = localStorage.getItem('user_token');

        fetch(Constants.PROJECT_BASE_URL + '/stats', {
            headers: {
                'Authentication': token
            }
        })
            .then(response => response.json())
            .then(data => {
                const ordersElement = document.getElementById('totalOrders');
                const revenueElement = document.getElementById('totalRevenue');

                // Define styles dynamically
                const numberStyle = "font-size: 2.5rem !important; font-weight: 800 !important; line-height: 1.2 !important; letter-spacing: -1px !important;";

                // Update Total Orders
                if (ordersElement) {
                    ordersElement.innerText = data.total_orders;
                    ordersElement.style.cssText = numberStyle + " color: #111 !important;";
                }

                // Update Revenue
                if (revenueElement) {
                    const formattedRevenue = parseFloat(data.total_revenue).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    revenueElement.innerText = '$' + formattedRevenue;
                    revenueElement.style.cssText = numberStyle + " color: #0d6efd !important;";
                }
            })
            .catch(error => console.error('Error fetching stats:', error));
    },

    // 2. Fetch, Group, and Render Orders Table
    initializeOrdersTable: function () {
        const token = localStorage.getItem('user_token');

        fetch('http://localhost/web/backend/admin/orders', {
            headers: {
                'Authentication': token
            }
        })
            .then(response => response.json())
            .then(data => {
                const table = document.querySelector('#ordersTable');
                const tbody = table.querySelector('tbody');

                // Safety check in case table doesn't exist
                if (!table || !tbody) return;

                tbody.innerHTML = '';

                const headers = table.querySelectorAll('th');
                headers.forEach(th => {
                    th.style.cssText = "padding: 20px 25px !important; border-bottom: 2px solid #eee !important; color: #6c757d !important; font-weight: 700 !important; text-transform: uppercase !important; font-size: 0.75rem !important; letter-spacing: 1px !important; background-color: #f9fafb !important;";
                });

                // --- B. Group Data by Order ID ---
                const groupedOrders = {};
                data.forEach(item => {
                    const id = item.orders_id || item.order_id;
                    if (!groupedOrders[id]) {
                        groupedOrders[id] = {
                            id: id,
                            user_id: item.orders_user_id,
                            total_amount: item.orders_total_amount,
                            books: []
                        };
                    }
                    groupedOrders[id].books.push(item.books_title);
                });

                // --- C. Define Cell Styles ---
                const rowStyle = "border-bottom: 1px solid #f0f0f0 !important; transition: background 0.2s !important;";
                const cellStyle = "padding: 24px 25px !important; vertical-align: top !important; color: #333 !important; font-size: 0.95rem !important; background-color: #fff !important;";

                // Specific inner styles
                const idStyle = "font-family: 'Courier New', Courier, monospace !important; font-weight: 700 !important; color: #333 !important;";
                const userBadgeStyle = "background: #f1f5f9 !important; padding: 6px 12px !important; border-radius: 20px !important; color: #475569 !important; font-size: 0.85rem !important; font-weight: 600 !important; display: inline-block !important;";
                const bookItemStyle = "display: block !important; margin-bottom: 8px !important; color: #444 !important; font-weight: 500 !important;";
                const priceStyle = "font-weight: 700 !important; color: #2c3e50 !important; font-size: 1.05rem !important;";

                // --- D. Render Rows ---
                Object.values(groupedOrders).forEach(order => {
                    const row = document.createElement('tr');
                    row.style.cssText = rowStyle;

                    row.onmouseover = function () { this.style.backgroundColor = "#fafafa"; };
                    row.onmouseout = function () { this.style.backgroundColor = "transparent"; };

                    const booksHtml = order.books.map(book =>
                        `<span style="${bookItemStyle}">
                        <span style="color:#ccc; margin-right:8px;">•</span>${book}
                     </span>`
                    ).join('');

                    row.innerHTML = `
                    <td style="${cellStyle} ${idStyle}">
                        #${order.id}
                    </td>
                    <td style="${cellStyle}">
                        <span style="${userBadgeStyle}">
                            User: ${order.user_id}
                        </span>
                    </td>
                    <td style="${cellStyle}">
                        ${booksHtml}
                    </td>
                    <td style="${cellStyle} ${priceStyle}">
                        $${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                `;

                    tbody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }
};