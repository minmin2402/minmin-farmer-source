export const NODE_CATEGORIES = {
  GENERAL: 'Hành động Chung',
  INTERACT: 'Tương tác Thiết bị',
  LOGIC: 'Logic & Điều kiện',
  APP: 'Quản lý Ứng dụng',
  FILE: 'Quản lý Tệp'
};

export const ACTION_TYPES = [
  { type: 'tap_xy', label: 'Chạm (XY)', category: NODE_CATEGORIES.INTERACT },
  { type: 'tap_xpath', label: 'Chạm (XPath)', category: NODE_CATEGORIES.INTERACT },
  { type: 'open_app', label: 'Mở App', category: NODE_CATEGORIES.APP },
  { type: 'wait', label: 'Đợi (ms)', category: NODE_CATEGORIES.GENERAL },
  // Thêm đầy đủ các loại khác vào đây...
];