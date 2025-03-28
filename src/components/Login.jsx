import { useContext, useState } from 'react';
import UserContext from './contexts/UserContext';
import api from './constants/urls';
import { useNavigate } from 'react-router-dom';

function Login() {
  let user = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    login: '',
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  let handleInput = (e) => {
    const { name, value } = e.target;
    setErrors((prevError) => ({
      ...prevError,
      login: null,
    }));

    // Basic Form Validation....
    switch (name) {
      case 'email':
        {
          if (value === '') {
            setErrors((prevError) => ({
              ...prevError,
              [name]: `Email field can't be empty`,
            }));
          } else {
            setErrors((prevError) => ({
              ...prevError,
              [name]: null,
            }));
          }
        }
        break;
      case 'password': {
        if (value === '') {
          setErrors((prevError) => ({
            ...prevError,
            [name]: `Password field can't be empty`,
          }));
        } else {
          setErrors((prevError) => ({
            ...prevError,
            [name]: null,
          }));
        }
        break;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await fetch(`${api.login}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      let data = await res.json();
      if (!res.ok) throw data;

      user.setUser({
        isActive: true,
        token: data.token,
        email: formData.email,
      });
      localStorage.setItem(
        'activeUser',
        JSON.stringify({
          isActive: true,
          token: data.token,
          email: formData.email,
        })
      );
      navigate('/');
    } catch (error) {
      setErrors((prevError) => ({
        ...prevError,
        login: error.error,
      }));
    }
  };

  return (
    <>
      <div className="flex h-[100vh] bg-gradient-to-tl from-[black] to-[white] m-auto justify-center items-center md:text-lg lg:text-xl p-5">
        <form
          method="post"
          className="w-[25rem] md:w-[35rem] lg:w-[45rem] text-center mt-5"
        >
          <fieldset className="border p-8">
            <legend>
              <h2 className="text-5xl text-black">
                <i className="fa-solid fa-user"></i>
              </h2>
            </legend>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Mail"
              className="p-4 border-[1px] border-solid border-black w-full my-1.5 outline-none hover:border-white"
              onChange={handleInput}
              value={formData.email}
            />
            {errors?.email && (
              <p className="text-red-900 mb-1.5">{errors.email}</p>
            )}

            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              className="p-4 border-[1px] border-solid w-full mb-1.5 outline-none hover:border-white"
              onChange={handleInput}
              value={formData.password}
            />
            {errors?.password && (
              <p className="text-red-900 mb-1.5">{errors.password}</p>
            )}

            <button
              className="text-white cursor-pointer to-[] p-4 w-full rounded-2xl mb-4 border-[1px] border-solid bg-gradient-to-r from-[#c6c4c4] to-[#9d8787] animate-pulse hover:animate-none mt-4"
              onClick={handleSubmit}
              disabled={errors?.email || errors?.password}
            >
              {loading ? 'Loggin In' : 'Login'}
            </button>
            {errors?.login && <p className="text-red-500">{errors.login}</p>}
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default Login;
