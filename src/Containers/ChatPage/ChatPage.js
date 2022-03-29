import React, { useEffect, useState } from 'react';
import { getConsultantById, fetchCurrentUser, getLatestConsultationByClientId, fireAuth, getConsultationChat, sendChat, getClientListByConsultantId } from '../../service';
import './ChatPage.css';
import StarIcon from '@material-ui/icons/Star';
import { Grid, TextField } from '@material-ui/core';
import IconNext from '../../Assets/icons/IconNext';

const ChatPage = () => {
  const [item, setItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [chats, setChats] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState('');
  const [clientId, setClientId] = useState(null);
  const [role, setRole] = useState('client');
  const [consultantId, setConsultantId] = useState(null);
  const [selectedClientChat, setSelectedClientChat] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      fireAuth.onAuthStateChanged(async user => {
        if (user) {
          const fetchedCurrentUser = await fetchCurrentUser();
          let fetchedLatestConsultation = null;
          let fetchedChatList = [];
          if (fetchedCurrentUser.role === 'client'){
            fetchedLatestConsultation = await getLatestConsultationByClientId(fetchedCurrentUser.id);
          } else if (fetchedCurrentUser.role === 'consultant'){
            fetchedChatList = await getClientListByConsultantId(fetchedCurrentUser.id);
          }

          console.log(fetchedChatList);

          // if you were a client and has an ongoing consultation...
          if (!!fetchedLatestConsultation){
            console.log(fetchedLatestConsultation);
            const { klien_id, konsultan_id } = fetchedLatestConsultation;
            const fetchedItem = await getConsultantById(konsultan_id)
            const fetchedChats = await getConsultationChat(klien_id, konsultan_id);

            setItem(fetchedItem);
            setChats(fetchedChats);
            setClientId(klien_id);
            setConsultantId(konsultan_id);

            console.log(fetchedChats);
          } else if (fetchedChatList.length > 0) { // if you were a consultant with at least one client...
            const fetchedItem = await getConsultantById(fetchedCurrentUser.id);
            const fetchedChats = await getConsultationChat(fetchedChatList[selectedClientChat].id, fetchedCurrentUser.id);

            setItem(fetchedItem)
            setChats(fetchedChats);
            setChatList(fetchedChatList);
            setClientId(fetchedChatList[selectedClientChat].id);
            setConsultantId(fetchedCurrentUser.id);
          }
          console.log(fetchedLatestConsultation);
          setCurrentUser(fetchedCurrentUser);
          setRole(fetchedCurrentUser.role === 'client' ? 'klien' : 'konsultan');
        }
      })
    }
    fetchData();
  }, [refresh]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser === null) return;
      const fetchedItem = await getConsultantById(currentUser.id);
      const fetchedChats = await getConsultationChat(chatList[selectedClientChat].id, currentUser.id);

      setItem(fetchedItem)
      setChats(fetchedChats);
      setClientId(chatList[selectedClientChat].id);
      setConsultantId(currentUser.id);
    }
    fetchData();
  }, [selectedClientChat]);

  console.log('role:', role);

  const renderChatList = () => {
    return chatList.map((chatItem, idx) => {
      const { name, picture, message: messageChat } = chatItem;
      return <Grid item xs={12}>
        <div
          style={{
            display: 'flex',
            padding: '0 20px 20px 20px',
            borderBottom: '1px solid #E5E5E5',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedClientChat(idx)}
        >
          <img
            src={picture || require('../../Assets/images/logo-bw.png')}
            className={item.picture ? 'chat-detail-image-small' : 'chat-detail-image-empty'}
            alt=''
          />
          <div style={{
            marginLeft: '20px'
          }}>
            <h3>{name}</h3>
            <p>{`${messageChat.slice(0,18)}...`}</p>
          </div>
        </div>
      </Grid>
    })
  }

  const renderChats = () => {
    return chats.map(chat => {
      const { pengirim, pesan } = chat;
      return (
        <div className={pengirim === role ? 'chat-bubble-mine' : 'chat-bubble-others'}>
          {pesan}
        </div>
      )
    })
  }

  const handleSendChat = async () => {
    await sendChat(message, role, clientId, consultantId);
    setMessage('')
    setRefresh(refresh + 1);
  }

  console.log(chatList);

  const renderChatProfile = () => {
    const pictureSource = () => {
      if (role === 'konsultan') {
        if (chatList.length > 0) {
          const { picture } = chatList[selectedClientChat];
          return picture || require('../../Assets/images/logo-bw.png')
        }
      } else {
        return item.picture || require('../../Assets/images/logo-bw.png')
      }
    }

    const nameSource = () => {
      if (role === 'konsultan') {
        if (chatList.length > 0) {
          const { name } = chatList[selectedClientChat];
          return name || ''
        }
      } else {
        return item.nama
      }
    }

    return (
      <div
        style={{
          display: 'flex',
          marginBottom: '40px',
          padding: '0 40px 40px 40px',
          borderBottom: '1px solid #E5E5E5'
        }}
      >
        <img
          src={pictureSource()}
          className={item.picture ? 'chat-detail-image' : 'chat-detail-image-empty'}
          alt=''
        />
        <div style={{marginLeft: '20px'}}>
          <h2 className='chat-detail-title'>{nameSource()}</h2>
          {
            role === 'klien' ? <div className='chat-rating'>
              <StarIcon style={{color: '#FFC107'}}/>
              {`4.9/5`}
            </div> : <></>
          }
        </div>
      </div>
    )
  } 

  const renderChatWindow = () => {
    return (
      <div className='chat-detail-wrapper'>
        <div style={{marginTop: '20px'}}>
          <Grid container>
            {
              role === 'konsultan' ?
              <Grid item xs={3}>
                <div style={{borderRight: '1px solid #E5E5E5', width: '100%', height: '100%', maxHeight: '650px', overflow: 'scroll'}}>
                  <Grid container>
                    <div style={{width: '100%'}}>
                    {renderChatList()}
                    </div>
                  </Grid>
                </div>
              </Grid> : <></>
            }
            <Grid item xs={role === 'konsultan' ? 9 : 12}>
              <Grid container>
                <Grid item xs={12}>
                  {renderChatProfile()}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div style={{height: '350px', overflow: 'scroll'}}>
                  {renderChats()}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  style={{
                    width: '100%',
                    border: '1px solid #E5E5E5'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <div style={{display: 'flex'}}>
                  <div style={{marginLeft: '20px', padding: '40px', width: '85%'}}>
                    <TextField
                      fullWidth
                      id="chat"
                      placeholder="Tulis pesanmu disini"
                      value={message}
                      onChange={(e) => {setMessage(e.target.value)}}
                    />
                  </div>
                  <div
                    className='chat-detail-redirect-button'
                    onClick={() => handleSendChat()}
                  >
                    <IconNext />
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }

  const renderEmptyPage = () => {
    return (
      <div style={{
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '200px',
        color: '#C5C5C5'
      }}>
        <h1>Tidak ada pesan masuk</h1>
      </div>
    )
  }

  return (
    <>
      {
        item !== null ?
          renderChatWindow()
          : renderEmptyPage()
      }
    </>
  )

}
export default ChatPage;