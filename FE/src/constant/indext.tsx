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

export const FRESHNESS_COLORS = {
    'fresh': ['#4CAF50', '#45B649'],
    'slightly_wilted': ['#FF9800', '#F7971E'],
    'wilted': ['#F44336', '#E57373'],
    'expired': ['#795548', '#8D6E63']
}

export const FRESHNESS_LABELS = {
    'fresh': 'Tươi mới',
    'slightly_wilted': 'Hơi héo',
    'wilted': 'Đã héo',
    'expired': 'Hết hạn'
}
export const PRODUCT_STATUS_LABELS = {
    'available': 'Có sẵn',
    'unavailable': 'Không có sẵn',
    'sold': 'Đã bán',
    'pending': 'Chờ xác nhận',
}


export type FreshnessColors = keyof typeof FRESHNESS_COLORS;
export type FreshnessLabels = keyof typeof FRESHNESS_LABELS;
export type OrderStatus = keyof typeof ORDER_STATUS_COLORS;
export type OrderStatusLabel = keyof typeof ORDER_STATUS_LABELS;
export type ProductStatus = keyof typeof PRODUCT_STATUS_LABELS;
export type ProductStatusLabel = keyof typeof PRODUCT_STATUS_LABELS;