import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../util/auth';
import { createUser, getUserByUsername } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, password } = req.body;

  const userAlreadyExists =
    typeof (await getUserByUsername(username)) !== 'undefined';

  if (userAlreadyExists) {
    return res
      .status(409)
      .send({ errorMessage: 'User already exists', user: null });
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser(username, passwordHash);

  res.send({ user: user });
}
