const nodemailer = require('nodemailer');

// ✅ cấu hình SMTP ổn định hơn Gmail service
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Gửi email nhắc nhở quá hạn
 */
const sendOverdueEmail = async (toEmail, readerName, overdueItems) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Thiếu cấu hình MAIL_USER hoặc MAIL_PASS");
    }

    if (!toEmail) {
      throw new Error("Email người nhận bị undefined");
    }

    console.log("📧 Đang gửi tới:", toEmail);

    const rows = overdueItems.map(item => `
      <tr>
        <td>${item.tenSach}</td>
        <td>${item.ngayTraDuKien}</td>
        <td>Quá ${item.soNgayQuaHan} ngày</td>
      </tr>
    `).join('');

    const html = `
      <h2>Nhắc nhở trả sách</h2>
      <p>Xin chào <b>${readerName}</b></p>
      <p>Bạn có ${overdueItems.length} sách quá hạn:</p>
      <table border="1" cellpadding="5">
        <tr>
          <th>Tên sách</th>
          <th>Hạn trả</th>
          <th>Trạng thái</th>
        </tr>
        ${rows}
      </table>
    `;

    const info = await transporter.sendMail({
      from: `"LibraTech 📚" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: `Bạn có ${overdueItems.length} sách quá hạn`,
      html,
    });

    console.log("✅ Gửi thành công:", info.response);

  } catch (err) {
    console.error("❌ LỖI GỬI MAIL:", err);
    throw err;
  }
};

module.exports = { sendOverdueEmail };