import {
  Grid, ListItemIcon,
  ListItemText, Menu,
  MenuItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircleTwoTone } from '@material-ui/icons';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { fetchCurrentUser, fireAuth, getLatestConsultationByClientId, signOut } from '../../service';
import './Navbar.css';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [redirectConsultation, setRedirectConsultation] = useState('/consultant');

  const history = useHistory();
  const location = useLocation();


  useEffect(() => {
    const fetchData = async () => {
      fireAuth.onAuthStateChanged(async user => {
        if (user) {
          const fetchedCurrentUser = await fetchCurrentUser();
          console.log('current user:', fetchedCurrentUser);
          setCurrentUser(fetchedCurrentUser);
          const fetchedRedirectConsultation = await handleRedirectConsultation(fetchedCurrentUser);
          setRedirectConsultation(fetchedRedirectConsultation);
        }
      })
    }
    fetchData();
  }, [location]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    history.push('/login');
  }

  const renderLoginPrompt = () => {
    const messageAndPrompt = {
      login: {
        message: 'Belum memiliki akun?',
        prompt: 'Daftar',
        style: {
          margin: '0 10px'
        },
        redirect: ['/register', '/register']
      },
      register: {
        message: 'Sudah memiliki akun?',
        prompt: 'Login',
        style: {
          margin: '0 10px'
        },
        redirect: ['/login', '/login']
      },
      loggedIn: {
        message: 'Daftar',
        prompt: 'Login',
        style: {
          margin: '0 10px',
          cursor: 'pointer'
        },
        redirect: ['/register', '/login']
      }
    }

    const renderMenuMessageAndPrompt = () => {
      const { pathname } = location;
      const { login, register, loggedIn } = messageAndPrompt;
      if (pathname === '/login') {
        return login;
      } else if (pathname === '/register') {
        return register;
      } else {
        return loggedIn;
      }
    }

    return (
      <div className='navbar-menu'>
        <div
          style={renderMenuMessageAndPrompt().style}
          onClick={() => history.push(renderMenuMessageAndPrompt().redirect[0])}
        >
          <h5>{renderMenuMessageAndPrompt().message}</h5>
        </div>
        <div className='login-prompt-btn'
          onClick={() => history.push(renderMenuMessageAndPrompt().redirect[1])}
        >
          <h5>{renderMenuMessageAndPrompt().prompt}</h5>
        </div>
      </div>
    )
  }

  const renderLoggedInNavbarMenu = () => {
    return (
      <div className='navbar-menu'>
        <div>
          <div className='item' onClick={handleProfileClick}>
            <PersonOutlineIcon style={{ fontSize: '28px' }} />
          </div>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <div style={{ margin: '0 20px 0 20px' }}>
              <Grid container>
                <Grid item xs={3}>
                  <div style={{ margin: '20px 0 0 0' }}>
                    <AccountCircleTwoTone fontSize='large' />
                  </div>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={7}>
                  <div className='text-no-margin'>
                    <h5>{!!currentUser ? currentUser.nama : '-'}</h5>
                    <h6>
                      {
                        currentUser?.role === "client" ? "Klien" : "Konsultan"
                      }
                    </h6>
                  </div>
                </Grid>
              </Grid>
            </div>
            <StyledMenuItem onClick={() => handleLogout()}>
              <ListItemText primary="Keluar" />
              <ListItemIcon />
            </StyledMenuItem>
          </StyledMenu>
        </div>
      </div>
    )
  }

  const handleRedirectConsultation = async (fetchedCurrentUser) => {
    if (fetchedCurrentUser.role === 'consultant') return '/chat';
    if (fetchedCurrentUser === null) return '/consultant';

    const latestConsultation = await getLatestConsultationByClientId(fetchedCurrentUser.id);

    if (latestConsultation === null) return '/consultant';

    const { tanggal } = latestConsultation;
    const endConsultationDateTime = moment(tanggal).add(1, 'hours');
    const currentDateTime = moment();

    if (currentDateTime.diff(endConsultationDateTime, 'minutes') > 0) return '/consultant';

    return '/chat';
  }


  const NavbarMenu = () => {
    const { pathname } = location;
    const linkPoint = pathname.split('/').pop()
    const menuItems = [
      {
        'title': 'Konsultasi',
        'redirect': redirectConsultation
      },
      {
        'title': 'Artikel',
        'redirect': '/news'
      },
      {
        'title': 'Produk',
        'redirect': '/product'
      }
    ]
    if (!!currentUser) {
      menuItems.push({
        'title': 'Riwayat',
        'redirect': '/transaction'
      })
    }
    return (
      <Fragment>
        {
          menuItems.map((item, key) => (
            <NavLink
              key={key}
              to={item.redirect}
              className="item menu-item"
            >
              {item.title}
            </NavLink>
          ))
        }
      </Fragment>
    )
  }

  return (
    <>
      <div className="navbar-full-wrapper">
        <div style={{ width: '300px', cursor: 'pointer', backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.1)' }} onClick={() => history.push('/')} />
        <div className="navbar-wrapper">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className='navbar-menu'>
              <NavbarMenu />
            </div>
            <div
              style={{
                width: `${location.pathname === '/login' ||
                  location.pathname === '/register' ?
                  '50%' : '20%'
                  }`,
                marginLeft: '20px'
              }}
            >
              {
                !!currentUser &&
                  !(location.pathname === '/login' ||
                    location.pathname === '/register') ?
                  renderLoggedInNavbarMenu() : renderLoginPrompt()
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar;