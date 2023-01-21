import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { getConsultantById, startNewConsultation, fetchCurrentUser } from '../../service';
import './ConsultantDetailPage.css';
import StarIcon from '@material-ui/icons/Star';
import { Grid, Snackbar } from '@material-ui/core';
import { formattedCurrency } from '../../Constants/format';
import MuiAlert from '@material-ui/lab/Alert';
import { ArrowBack } from '@material-ui/icons';

const ConsultantDetailPage = () => {
  const { id } = useParams();
  const history = useHistory()
  const [item, setItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedConsultant = await getConsultantById(id);
      const fetchedCurrentUser = await fetchCurrentUser();
      setItem(fetchedConsultant);
      setCurrentUser(fetchedCurrentUser);
      console.log(fetchedCurrentUser);
    }
    fetchData();
  }, [refresh]);

  const handleConsultationTransaction = async () => {
    // handle transaction to service
    if (currentUser === null || item === null) {
      setSeverity('error');
      setMessage('Terjadi kesalahan. Login terlebih dahulu');
    } else {
      setSeverity('success');
      setMessage('Konsultan siap menjawab pertanyaan anda');

      const data = await startNewConsultation(currentUser.id, id, item.harga)
      console.log(data)
    }

    setOpenSnackbar(true);
    setRefresh(refresh + 1);
  }

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const renderItemDetails = () => {
    if (item === null) return;
    return (
      <>
        <div className='consultant-detail-wrapper'>
          <button
            onClick={() => history.goBack()}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: 10
            }} >
            <ArrowBack />
            <p style={{
              fontSize: 18
            }}>Kembali</p>
          </button>

          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div style={{ display: 'flex', marginBottom: '40px', padding: '0 40px' }}>
                  <img
                    src={item.picture || require('../../Assets/images/logo-bw.png')}
                    className={item.picture ? 'consultant-detail-image' : 'consultant-detail-image-empty'}
                    alt=''
                  />
                  <div style={{ marginLeft: '20px' }}>
                    <h2 className='consultant-detail-title'>{item.nama}</h2>
                    <div className='consultant-rating'>
                      <StarIcon style={{ color: '#FFC107' }} />
                      {`4.9/5`}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: 'flex', padding: '0 40px' }}>
                  <img
                    src={require('../../Assets/images/education.png')}
                    style={{ height: '50px', width: '50px' }}
                    alt=''
                  />
                  <div style={{ marginLeft: '20px' }}>
                    <h3 style={{ color: '#9A9A9A' }}>Pendidikan</h3>
                    <h3>{item.pendidikan}</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', padding: '0 40px' }}>
                  <img
                    src={require('../../Assets/images/experience.png')}
                    style={{ height: '50px', width: '50px' }}
                    alt=''
                  />
                  <div style={{ marginLeft: '20px' }}>
                    <h3 style={{ color: '#9A9A9A' }}>Pengalaman</h3>
                    <h3>{item.pengalaman}</h3>
                  </div>
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
              <Grid item xs={9}>
                <div style={{ marginLeft: '20px', padding: '0 40px' }}>
                  <h3 style={{ color: '#9A9A9A' }}>Biaya Konsultasi</h3>
                  <div style={{ display: 'flex' }}>
                    <div className='consultant-detail-price'>
                      {formattedCurrency(item.harga)}
                    </div>
                    <p style={{ color: '#9A9A9A', justifyContent: 'center', marginLeft: '10px' }}>
                      per jam
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3}>
                <div
                  className='consultant-detail-redirect-button'
                  onClick={() => handleConsultationTransaction()}
                >
                  <h4>Konsultasi</h4>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    )
  }

  const renderSnackbar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    )
  }

  return (
    <>
      {renderItemDetails()}
      {renderSnackbar()}
    </>
  )

}
export default ConsultantDetailPage;