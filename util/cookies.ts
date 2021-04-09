import Cookie from 'cookie';
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

export function serializeSecureCookieServerSide(
  name: string,
  value: string,
  maxAge = 60 * 60 * 24 * 7,
) {
  const isProduction = process.env.NODE_ENV === 'production';

  return Cookie.serialize(name, value, {
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}

export function serializeEmptyCookieServerSide(name: string) {
  return Cookie.serialize(name, '', {
    maxAge: -1,
    path: '/',
  });
}
