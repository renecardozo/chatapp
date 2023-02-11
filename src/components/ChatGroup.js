import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import chat from '../lib/chat';
import { configChat } from '../config';

function ChatGroup() {
  const [receiverID, setReceiverID] = useState('');
  const [messageText, setMessageText] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAithenticated] = useState(true);
  const navigate = useNavigate();
  const GUID = configChat.GUID;

  useEffect(() => {
    getUser();
    messageListener();
  }, []);

  const messageListener = () => {
    chat
      .addMessageListener((data, error) => {
        if (error) {
          return console.log(`Error: ${error}`);
        }
        setGroupMessages(prevGroupMessages => {
          return [...prevGroupMessages, data]
        });
        scrollToBottom();
      });
  }

  const sendMessage = () => {
    chat
      .sendGroupMessage(GUID, messageText)
      .then( message => {
        console.log('Message sent successfully!', message);
        console.log(groupMessages);
        setGroupMessages(prevGroupMessages => {
          return [...prevGroupMessages, message]
        });
        setMessageText(null);
        scrollToBottom();
      })
      .catch(error => {
        if (error.code === 'ERR_NOT_A_MEMBER') {
          chat.joinGroup(GUID)
              .then(() => sendMessage())
        } else {
          console.log(error);
        }
      });
  }
  const scrollToBottom = () => {
    const chat = document.getElementById('chatList');
    chat.scrollTop = chat.scrollHeight;
  }

  const handleSubmit = event => {
    event.preventDefault();
    sendMessage();
    event.target.reset();
  }

  const handleChange = event => {
    setMessageText(event.target.value);
  }

  const getUser = () => {
    chat
      .getLoggedinUser()
      .then(user => {
        console.log('User detail: ', user);
        setUser(user);
      })
      .catch(error => {
        if (error.code === 'USER_NOT_LOGED_IN') {
          setIsAithenticated(false);
        }
      })
  }

  const redirectToLogin = () => {
    navigate('/');
  }

  return(
    <>
      {!isAuthenticated ? redirectToLogin() : (
        <div className='chatWindow'>
          <ul className='chat' id='chatList'>
            {groupMessages.map(msg => (
              <div key={msg.id}>
                {
                  user.uid === msg.sender.uid ? (
                    <li className='self'>
                      <div className='msg'>
                        <p>{msg.sender.uid}</p>
                        <div className='message'>
                          {msg.data.text}
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li className='other'>
                      <div className='msg'>
                        <p>{msg.sender.uid}</p>
                        <div className='message'>
                          {msg.data.text}
                        </div>
                      </div>
                    </li>
                  )
                }
              </div>
            ))}
          </ul>
          <div className='chatInputWrapper'>
            <form onSubmit={handleSubmit}>
              <input
                className='textarea input'
                type='text'
                placeholder='Enter your message...'
                onChange={handleChange}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatGroup;