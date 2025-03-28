import { useContext } from 'react';
import UserContext from './contexts/UserContext';
import { NavLink, useNavigate } from 'react-router-dom';

function LoggedUser({ user, userData, navigate }) {
  return (
    <nav className="flex justify-center items-center sm:flex-row sm:justify-between">
      <NavLink
        to={'/'}
        className="bg-neutral-400 p-3 rounded-2xl hover:bg-neutral-600 cursor-pointer shadow-2xl"
      >
        Home
      </NavLink>
      <h2 className="mx-1.5">{user?.email}</h2>
      {user && (
        <button
          className="bg-neutral-400 p-3 rounded-2xl hover:bg-neutral-600 cursor-pointer shadow-2xl shadow-neutral-50"
          onClick={() => {
            userData.setUser(null);
            localStorage.removeItem('activeUser');
            navigate('/login');
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}

function NonLoggedUser({ navigate }) {
  return (
    <>
      <nav className="flex justify-center items-center flex-col sm:flex-row sm:justify-between">
        <NavLink
          to={'/'}
          className="bg-neutral-400 p-3 rounded-2xl hover:bg-neutral-600 cursor-pointer shadow-2xl mr-5"
        >
          Home
        </NavLink>
        <button
          className="bg-neutral-400 p-3 rounded-2xl hover:bg-neutral-600 cursor-pointer shadow-2xl shadow-neutral-50"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </nav>
    </>
  );
}
function Header() {
  let userData = useContext(UserContext);
  let { user } = userData;

  const navigate = useNavigate();

  return (
    <section className="bg-neutral-800 text-white p-3">
      <header className=" w-5/6 m-auto flex flex-col justify-center items-center sm:flex-row sm:justify-between">
        <div className="mr-1.5">Logo</div>
        {user && user?.isActive ? (
          <LoggedUser user={user} userData={userData} navigate={navigate} />
        ) : (
          <NonLoggedUser navigate={navigate} />
        )}
      </header>
    </section>
  );
}

export default Header;
