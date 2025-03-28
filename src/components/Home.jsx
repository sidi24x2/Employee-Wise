import { useContext } from 'react';
import UserContext from './contexts/UserContext';
import AllUsers from './AllUsers';

function Home() {
  let userData = useContext(UserContext);
  let { user } = userData;

  return (
    <>
      <div>
        {user && !user.isActive ? (
          <h2 className="mt-5 text-center text-2xl animate-pulse">
            Login First
          </h2>
        ) : (
          <AllUsers />
        )}
      </div>
    </>
  );
}

export default Home;
