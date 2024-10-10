export const ORDER_STATUS_COLORS = {
    'pending': '#FF9800', // Màu cam
    'delivering': '#2196F3', // Màu xanh dương
    'delivered': '#4CAF50', // Màu xanh lá
};

export type OrderStatus = keyof typeof ORDER_STATUS_COLORS;