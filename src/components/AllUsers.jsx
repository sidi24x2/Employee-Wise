import { useContext, useEffect, useState } from 'react';
import api from './constants/urls';
import UserContext from './contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function AllUsers() {
  let [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(users);
  let [page, setPage] = useState({
    activePage: 1,
    totalPage: 1,
  });
  const activeUser = useContext(UserContext);

  const [error, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Setting Active Page COunt
  useEffect(() => {
    let fetchUsers = async () => {
      try {
        setLoading(true);
        let res = await fetch(api.getUser + page.activePage);
        let data = await res.json();
        if (!res.ok) throw data;

        setUsers(data.data);
        setFilteredUsers(data.data);
        setPage((prevData) => ({
          ...prevData,
          totalPage: data.total_pages,
        }));
      } catch (error) {
        setErrors({ users: error });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page.activePage]);

  useEffect(() => {}, [users, filteredUsers]); // This will run when 'users' changes

  // Checking if User is Logged In

  if (activeUser.user === null)
    return (
      <h2 className="mt-5 text-center text-2xl animate-pulse">Login First</h2>
    );
  if (error?.users) {
    return <h2>{error.users}</h2>;
  }

  if (!filteredUsers) {
    return (
      <>
        <h2 className="text-2xl font-semibold">Loading</h2>
      </>
    );
  }
  if (loading) {
    return (
      <h2 className="text-2xl text-center mt-3 animate-bounce">Loading...</h2>
    );
  }
  let arr = [];
  for (let i = 1; i <= page.totalPage; i++) {
    arr.push(i);
  }

  // Handling Edit

  function handleEdit(user) {
    navigate('users/edit/' + user.id);
  }

  // Handling Delete
  async function handleDelete(u) {
    setLoading(true);
    try {
      let res = await fetch(api.baseURL + 'users/' + u.id, {
        method: 'DELETE',
      });
      if (res.ok) alert('User ' + u.first_name + ' Has Been Deleted...');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(e) {
    if (e.target.value === 'first_name') {
      let sortedUsers = [...users].sort((a, b) =>
        a.first_name.localeCompare(b.first_name)
      );

      setFilteredUsers(sortedUsers);
    }
    if (e.target.value === 'last_name') {
      let sortedUsers = [...users].sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      );
      setFilteredUsers(sortedUsers);
    }
  }

  function handleSearch(e) {
    let searchVal = e.target.value.trim().toLowerCase();

    let filterUsers = [...users].filter(
      (u) =>
        u.first_name.toLowerCase().includes(searchVal) ||
        u.last_name.toLowerCase().includes(searchVal)
    );

    setFilteredUsers(filterUsers);
  }

  return (
    <section className="p-5 m-auto lg:text-xl md:text-lg sm:text-base">
      <main>
        <h2 className="text-2xl font-semibold underline text-center">
          Listing all the users
        </h2>
        <div className="flex justify-center items-center my-4">
          <input
            type="text"
            name="search"
            placeholder="Enter User Name"
            className="border-[1px] border-solid p-1.5"
            onChange={handleSearch}
          />
          <select
            name="select"
            className="p-1.5 ml-4 border-solid border-[1px]"
            onChange={handleFilter}
          >
            <option value="filter" hidden>
              Sort
            </option>
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
          </select>
        </div>
        {filteredUsers.length === 0 && (
          <h2 className="text-center text-2xl animate-bounce my-20">
            No User Found
          </h2>
        )}
        <ul className="flex flex-wrap justify-center">
          {filteredUsers.map((u) => {
            return (
              <li
                key={u.id}
                className="flex flex-col flex-wrap w-[80%] p-5 m-[1.5%] justify-stretch items-center shadow-2xl 
                lg:w-[24%] lg:m-2.5% lg:justify-center md:w-[25%] sm:w-[45%]"
              >
                <img
                  src={u.avatar}
                  alt={u.first_name}
                  className="rounded-[50%] object-cover w-24 h-24 sm:w-32 sm:h-32 md:h-36 md:w-36 lg:w-40 lg:h-40"
                />
                <div className="ml-1.5 flex flex-col items-center">
                  <h3>First-Name : {u.first_name}</h3>
                  <h3>Last-Name : {u.last_name}</h3>
                  <button
                    className="bg-amber-50  p-2 rounded w-full my-1.5 cursor-pointer hover:bg-amber-100"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-400 p-2 rounded w-full my-1.5 text-white hover:bg-red-500 cursor-pointer"
                    onClick={() => handleDelete(u)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
      {filteredUsers.length !== 0 && (
        <footer className="text-center">
          {arr.map((p) => {
            return (
              <button
                key={p}
                className="px-3 py-1 bg-neutral-400 m-1 text-white hover:bg-neutral-500 cursor-pointer a"
                onClick={() => {
                  setPage((prevData) => ({
                    ...prevData,
                    activePage: p,
                  }));
                }}
              >
                {p}
              </button>
            );
          })}
        </footer>
      )}
    </section>
  );
}

export default AllUsers;
