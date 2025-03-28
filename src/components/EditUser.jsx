import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './constants/urls';

function EditUser() {
  let id = useParams();

  const [user, setUser] = useState(null);
  const [error, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetch(api.baseURL + 'users/' + id.id)
        .then((res) => {
          return res.json();
        })
        .then((result) => setUser(result.data));
    } catch (error) {
      setErrors({ error: error });
    } finally {
      setLoading(false);
    }
  }, [id.id]);

  if (loading)
    return (
      <h2 className="animate-ping text-center text-2xl font-bold mt-5">
        Loading....
      </h2>
    );

  error?.error && <h2>{error.error}</h2>;

  if (!user)
    return (
      <>
        <h2 className="animate-ping text-center text-2xl font-bold mt-5">
          Loading....
        </h2>
      </>
    );

  let onChange = (e) => {
    let { name, value } = e.target;

    // Error handling

    if (value === '') {
      setErrors((prevError) => ({
        ...prevError,
        [name]: `Field Can't be empty`,
      }));
    } else {
      setErrors((prevError) => ({
        ...prevError,
        [name]: null,
      }));
    }

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);
    let res = await fetch(api.baseURL + 'users/' + user.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (res.ok) alert('User ' + user.first_name + ' is updated');
    navigate('/');
  }

  return (
    <>
      <section className="flex h-[100vh] bg-gradient-to-tl from-[black] to-[white] m-auto justify-center items-center">
        <form className=" w-[30rem] p-4 m-auto">
          <fieldset className="p-5 border-[1px] border-gray flex flex-col justify-center items-center">
            <legend className="text-2xl underline font-bold">
              Update User
            </legend>
            <input
              type="text"
              name="first_name"
              onChange={onChange}
              className="p-4 border-[1px] my-1 w-full outline-none "
              value={user.first_name}
            />
            {error?.first_name && (
              <p className="text-red-800 mb-1.5">
                First Name {error?.first_name}
              </p>
            )}
            <input
              type="text"
              name="last_name"
              onChange={onChange}
              className="p-4 border-[1px] my-1 w-full outline-none "
              value={user.last_name}
            />
            {error?.last_name && (
              <p className="text-red-800 mb-1.5">
                Last Name {error?.last_name}
              </p>
            )}
            <input
              type="email"
              name="email"
              onChange={onChange}
              className="p-4 border-[1px] my-1 w-full outline-none"
              value={user.email}
            />
            {error?.email && (
              <p className="text-red-800 mb-1.5">Email {error?.email}</p>
            )}
            <button
              className="px-4 py-3 bg-gray-600 rounded-2xl mt-2 text-white cursor-pointer disabled:cursor-not-allowed hover:bg-gray-500 "
              disabled={error?.email || error?.last_name || error?.first_name}
              onClick={handleClick}
            >
              Update User
            </button>
          </fieldset>
        </form>
      </section>
    </>
  );
}

export default EditUser;
