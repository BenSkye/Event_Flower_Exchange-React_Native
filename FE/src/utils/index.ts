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

export const formatDateTime = {
  // Format: DD/MM/YYYY HH:mm
  short: (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  // Format: DD tháng MM, YYYY HH:mm
  full: (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  // Chỉ lấy ngày tháng năm
  dateOnly: (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  },

  // Chỉ lấy giờ phút
  timeOnly: (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  //nếu thời gian trong ngày thì hiện giờ, nếu ngày khác thì hiện ngày tháng, nếu năm khác thì hiện ngày tháng năm
  timeMessage: (dateString: string) => {
    const date = new Date(dateString);
    if (date.getDate() === new Date().getDate()) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.getFullYear() === new Date().getFullYear()) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
  }
};