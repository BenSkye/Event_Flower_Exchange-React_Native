export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const formatInputPrice = (value: string): string => {
  // Loại bỏ tất cả các ký tự không phải số
  const number = value.replace(/[^0-9]/g, '');

  // Nếu số rỗng, trả về chuỗi rỗng
  if (number === '') return '';

  // Chuyển đổi sang số
  const amount = parseInt(number);

  // Định dạng số với dấu phân cách hàng nghìn
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};


export const parseInputPrice = (value: string): number => {
  return parseInt(value.replace(/\./g, ''));
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
}