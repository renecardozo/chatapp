import {useState} from 'react';
import spinner from '../logo.svg';
import chat from '../lib/chat';
import { useNavigate, Navigate } from 'react-router-dom';

function Login() {
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = (event) => {
    if(userName !== '') {
      event.preventDefault();
      login()
    }
  }

  const toggleIsSubmitted = () => {
    setIsSubmitting(!isSubmitting);
  }

  const handleInputChange = event => {
    setUserName(event.target.value);
  }

  const login = () => {
    toggleIsSubmitted();
    chat
      .login(userName)
      .then(user => {
        setUser(user);
        setIsAuthenticated(true);
      })
      .catch(error => {
        setErrorMessage('Please enter a valid username');
        toggleIsSubmitted();
        console.log(error);
      })
  }

  // const redirectToChatGroup = () => {
  //   navigate('/chat')
  // }

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/chat' replace={true} />
      ) : (
        <>
          <div className='App'>
            <h1>COMETCHAT</h1>
            <p>
              Create an account through your CometChat dashboard or login with one of our test users,
              superhero1, superhero2, etc.
            </p>
            <form className='form' onSubmit={onSubmit}>
              <input
                type='text'
                onChange={handleInputChange}
              />
              <span className='error'>
                {errorMessage}
              </span>
              {isSubmitting? (
                  <img
                    src={spinner}
                    alt='Spinner Component'
                    className='App-log'
                  />
                ):(
                  <input
                    type='submit'
                    disabled={userName === ''}
                    value='login'
                  />
                )
              }
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default Login;