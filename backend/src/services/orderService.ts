import { prisma } from '../config/prisma';

export class OrderService {
  static async createOrder(data: {
    userId: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
    totalAmount: number;
    discountAmount?: number;
    deliveryFee?: number;
    paymentMethod: string;
    deliveryAddress: string;
  }) {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    const order = await prisma.order.create({
      data: {
        user_id: data.userId,
        order_number: orderNumber,
        total_amount: data.totalAmount,
        discount_amount: data.discountAmount || 0,
        delivery_fee: data.deliveryFee || 50,
        payment_method: data.paymentMethod,
        delivery_address: data.deliveryAddress,
        items: {
          create: data.items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  static async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        tracking: true,
      },
    });
  }

  static async getUserOrders(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          tracking: true,
        },
      }),
      prisma.order.count({ where: { user_id: userId } }),
    ]);

    return { orders, total };
  }

  static async updateOrderStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  static async updatePaymentId(orderId: string, paymentId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        payment_id: paymentId,
        status: 'confirmed',
      },
    });
  }

  static async assignRider(orderId: string, riderId: string) {
    // Create or update order tracking
    const tracking = await prisma.orderTracking.upsert({
      where: { order_id: orderId },
      create: {
        order_id: orderId,
        rider_id: riderId,
        status: 'assigned',
      },
      update: {
        rider_id: riderId,
        status: 'assigned',
      },
    });

    return tracking;
  }

  static async updateOrderTracking(orderId: string, data: { latitude?: number; longitude?: number; status?: string }) {
    return prisma.orderTracking.update({
      where: { order_id: orderId },
      data,
    });
  }
}
