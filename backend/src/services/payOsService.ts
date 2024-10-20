import PayOS from "@payos/node";
import dotenv from 'dotenv';

dotenv.config();

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID ?? '',
  process.env.PAYOS_API_KEY ?? '',
  process.env.PAYOS_CHECKSUM_KEY ?? ''
);

export const createPaymentLink = async (
  orderCode: number,
  amount: number,
  description: string

) => {
  const requestData = {
    orderCode: orderCode,
    amount: amount,
    description: description,
    cancelUrl: process.env.DOMAIN_URL + "/v1/api/checkout/handle-payos-cancel",
    returnUrl: process.env.DOMAIN_URL + "/v1/api/checkout/handle-payos-return",
  }
  const paymentLink = await payos.createPaymentLink(requestData);
  return paymentLink;
}