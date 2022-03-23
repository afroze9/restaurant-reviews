import { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = (props) => {
  const initState = {
    name: '',
    id: ''
  };

  const [user, setUser] = useState(initState);
  const navigate = useNavigate();

  const login = () => {
    props.login(user);
    navigate('/');
  }

  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="user">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            name="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="user">ID</label>
          <input
            type="text"
            className="form-control"
            id="id"
            required
            value={user.id}
            onChange={(e) => setUser({ ...user, id: e.target.value })}
            name="name"
          />
        </div>

        <button onClick={login} className="btn btn-success">
          Login
        </button>
      </div>
    </div>
  )
}

export default Login;