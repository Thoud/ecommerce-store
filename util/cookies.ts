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

export function removeItemFromOrder(cookieArr: Order[], chocolateId: number) {
  return cookieArr.filter((cookie) => cookie.id !== chocolateId);
}

export function orderQuantityReducer(arr: Order[]) {
  return arr.reduce((acc: number, val: Order) => acc + val.quantity, 0);
}
