import { Order } from './types';

export function changeOrder(
  cookieArr: Order[],
  chocolateId: number,
  quantity: number,
) {
  const idInArray = cookieArr.some((cookie) => cookie.id === chocolateId);

  if (!idInArray) {
    return [
      ...cookieArr,
      {
        id: chocolateId,
        quantity: quantity,
      },
    ];
  }

  return cookieArr.map((cookie) => {
    if (cookie.id === chocolateId) {
      cookie.quantity = cookie.quantity + quantity;
    }

    return cookie;
  });
}
