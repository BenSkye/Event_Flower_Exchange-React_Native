export const ORDER_STATUS_COLORS = {
    'pending': '#FF9800', // Màu cam
    'completed': '#4CAF50', // Màu xanh lá
    'delivering': '#2196F3', // Màu xanh dương
    'delivered': '#4CAF50', // Màu xanh lá
};

export const ORDER_STATUS_LABELS = {
    'pending': 'Chờ xác nhận',
    'completed': 'Xác nhận',
    'delivering': 'Đang giao',
    'delivered': 'Đã giao',
};

export type OrderStatus = keyof typeof ORDER_STATUS_COLORS;
export type OrderStatusLabel = keyof typeof ORDER_STATUS_LABELS;