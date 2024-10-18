export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};


export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
}