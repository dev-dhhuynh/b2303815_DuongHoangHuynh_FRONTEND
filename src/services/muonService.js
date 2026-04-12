import api from './api';

const muonService = {
  getUserBorrows: async () => {
    try {
      const response = await api.get('/muon/me');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user borrows:', error);
      throw error;
    }
  },

  requestBorrow: async (bookData) => {
    try {
      const response = await api.post('/muon', bookData);
      return response.data;
    } catch (error) {
      console.error('❌ Error requesting borrow:', error);
      throw error;
    }
  },

  returnBook: async (borrowId) => {
    try {
      const response = await api.put(`/muon/return/${borrowId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401)
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      throw error;
    }
  },

  // ── Gia hạn sách ──
  renewBook: async (borrowId, soNgayGiaHan) => {
    try {
      const response = await api.put(`/muon/renew/${borrowId}`, { soNgayGiaHan });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401)
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      throw error;
    }
  },
};

export default muonService;