const sendOrderStatusNotification = async (order, user) => {
  if (!order || !user) return;

  const summary = {
    orderId: order._id,
    status: order.status,
    total: order.totalPrice,
    email: user.email || 'missing',
    phone: user.phone || 'missing',
  };

  console.log('[MOCK NOTIFICATION]', summary);
};

module.exports = { sendOrderStatusNotification };
