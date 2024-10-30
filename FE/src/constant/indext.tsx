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

export const AUCTION_STATUS_COLORS = {
    'in_auction': '#FF9800',
    'sold': '#4CAF50',
    'auction': '#F44336',
    'available': '#4CAF50',
    'unavailable': '#F44336',
    'ended': '#FF9800',
    'pending': '#2196F3',
    'active': '#2196F3',
}

export const AUCTION_STATUS_LABELS = {
    'in_auction': 'Đang đấu giá',
    'sold': 'Đã bán',
    'auction': 'Đấu giá',
    'available': 'Đang bán',
    'unavailable': 'Không có sẵn',
    'ended': 'Đã kết thúc',
    'pending': 'Chờ xác nhận',
    'active': 'Đang diễn ra',
}

export const FLOWER_STATUS_LABELS = {
    'in_auction': 'Đang đấu giá',
    'sold': 'Đã bán',
    'available': 'Đang bán',
    'unavailable': 'Không có sẵn',
}

export const FLOWER_FRENSHNESS_LABELS = {
    'fresh': 'Tươi',
    'slightly_wilted': 'Hơi héo',
    'wilted': 'Héo',
    'expired': 'Hết hạn',
}

export type OrderStatus = keyof typeof ORDER_STATUS_COLORS;
export type OrderStatusLabel = keyof typeof ORDER_STATUS_LABELS;