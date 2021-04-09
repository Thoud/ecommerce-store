import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import {
  getSessionByToken,
  getUserInformationByUrl,
} from '../../util/database';
import { User } from '../../util/types';

type Props = {
  user: User;
};

export default function UserSinglePage(props: Props) {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<User>(props.user);

  return (
    <>
      <h1>Welcome {user.firstName}!</h1>

      {!edit && (
        <>
          <h2>Personal information</h2>
          <div>
            <p>First name</p>
            <p>Last name</p>
            <p>Birthday</p>
            <p>Email</p>
            <p>Phone number</p>
          </div>
          <div>
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
            <p>{user.birthday}</p>
            <p>{user.email}</p>
            <p>{user.phoneNumber}</p>
          </div>

          <h2>Address</h2>
          <div>
            <p>Street and house number</p>
            <p>City</p>
            <p>ZIP code</p>
          </div>
          <div>
            <p>{user.address}</p>
            <p>{user.city}</p>
            <p>{user.zipCode}</p>
          </div>

          <button onClick={() => setEdit(true)}>Edit</button>
        </>
      )}

      {edit && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            setEdit(false);
          }}
        >
          <h2>Personal information</h2>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            defaultValue={user.firstName}
            onChange={({ target }) =>
              setUser({ ...user, firstName: target.value })
            }
          />

          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            defaultValue={user.lastName}
            onChange={({ target }) =>
              setUser({ ...user, lastName: target.value })
            }
          />

          <label htmlFor="birthday">Birthday</label>
          <input
            id="birthday"
            type="date"
            defaultValue={user.birthday}
            onChange={({ target }) =>
              setUser({ ...user, birthday: target.value })
            }
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            defaultValue={user.email}
            onChange={({ target }) => setUser({ ...user, email: target.value })}
          />

          <label htmlFor="phoneNumber">Phone number</label>
          <input
            id="phoneNumber"
            type="tel"
            defaultValue={user.phoneNumber}
            onChange={({ target }) =>
              setUser({ ...user, phoneNumber: target.value })
            }
          />

          <h2>Address</h2>
          <label htmlFor="address">Street and house number</label>
          <input
            id="address"
            type="text"
            defaultValue={user.address}
            onChange={({ target }) =>
              setUser({ ...user, address: target.value })
            }
          />

          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            defaultValue={user.city}
            onChange={({ target }) => setUser({ ...user, city: target.value })}
          />

          <label htmlFor="zipCode">ZIP code</label>
          <input
            id="zipCode"
            type="text"
            defaultValue={user.zipCode}
            onChange={({ target }) =>
              setUser({ ...user, zipCode: target.value })
            }
          />

          <button type="submit">Save changes</button>
        </form>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionByToken(context.req.cookies.session);
  const user = await getUserInformationByUrl(context.query.userUrl);

  if (!user || !session || session.userId !== user.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
}
