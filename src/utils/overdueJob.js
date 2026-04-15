const MuonSach = require('../models/MuonSach');
const { sendOverdueEmail } = require('./mailer');

const sendOverdueNotifications = async () => {
  try {
    console.log("🔥 START overdue job");

    const now = new Date();

    const overdueRecords = await MuonSach.find({
      status: 'approved',
      NgayTraDuKien: { $lt: now },
    })
      .populate('MaDocGia', 'HoLot Ten email')
      .populate('MaSach', 'TenSach');

    if (!overdueRecords || overdueRecords.length === 0) {
      console.log("⚠️ Không có dữ liệu quá hạn");
      return { sent: 0, errors: 0 };
    }

    const byReader = {};

    for (const rec of overdueRecords) {
      const reader = rec.MaDocGia;

      if (!reader || !reader.email) {
        console.log("❌ Bỏ qua do thiếu email");
        continue;
      }

      const key = String(reader._id);

      if (!byReader[key]) {
        byReader[key] = {
          email: reader.email,
          name: `${reader.HoLot || ''} ${reader.Ten || ''}`.trim(),
          items: [],
        };
      }

      const soNgayQuaHan = Math.floor(
        (now - new Date(rec.NgayTraDuKien)) / 86400000
      );

      byReader[key].items.push({
        tenSach: rec.MaSach?.TenSach || 'Không xác định',
        ngayTraDuKien: new Date(rec.NgayTraDuKien).toLocaleDateString('vi-VN'),
        soNgayQuaHan,
      });
    }

    let sent = 0;
    let errors = 0;

    for (const data of Object.values(byReader)) {
      try {
        console.log("👉 Gửi tới:", data.email);

        await sendOverdueEmail(data.email, data.name, data.items);

        sent++;
      } catch (err) {
        errors++;
        console.error("❌ Lỗi gửi:", err.message);
      }
    }

    return { sent, errors };

  } catch (err) {
    console.error("❌ Lỗi job:", err);
    throw err;
  }
};

module.exports = { sendOverdueNotifications };