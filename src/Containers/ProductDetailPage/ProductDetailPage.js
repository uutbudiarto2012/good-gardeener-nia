import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchCurrentUser, fireAuth, getProductById, purchaseProduct } from '../../service';
import './ProductDetailPage.css';
import { Grid, Snackbar, TextField } from '@material-ui/core';
import { formattedCurrency } from '../../Constants/format';
import MuiAlert from '@material-ui/lab/Alert';

const ProductDetailPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      fireAuth.onAuthStateChanged(async user => {
        if (user) {
          const fetchedCurrentUser = await fetchCurrentUser();
          console.log('current user:', fetchedCurrentUser);
          setCurrentUser(fetchedCurrentUser);
        }
      })
      const fetchedItem = await getProductById(id);
      console.log(fetchedItem);
      setItem(fetchedItem);
    }
    fetchData();
  }, [refresh]);

  const handleProductTransaction = async () => {
    if (item.stok < quantity) {
      setSeverity('error');
      setMessage('Stok barang tidak cukup!');
    } else {
      await purchaseProduct(currentUser.id, item.id, item.harga, quantity, item.stok);
      setSeverity('success');
      setMessage('Selamat, pembelian produk berhasil!');
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
      <div className='item-detail-wrapper'>
        <div style={{marginTop: '20px'}}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <img
                src={item.picture || require('../../Assets/images/logo-bw.png')}
                className={item.picture ? 'item-detail-image' : 'item-detail-image-empty'}
                alt=''
              />
            </Grid>
            <Grid item xs={6}>
              <h3 className='item-detail-title'>{item.nama}</h3>
              <h2>
                {`${formattedCurrency(item.harga)}`}
              </h2>
              <p style={{paddingRight: '48px'}}>
                {item.deskripsi}
              </p>
            </Grid>
            <Grid item xs={3}>
              <div className='item-detail-offer-pane'>
                <div style={{padding: '20px'}}>
                  <h4>Atur jumlah yang ingin dibeli</h4>
                  <TextField
                    id="outlined-number"
                    label={`Jumlah tersisa: ${item.stok}`}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    {renderActionButtons()}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }

  const renderActionButtons = () => {
    return (
      <div
      className='similar-item-redirect-button'
      onClick={() => handleProductTransaction()}
      >
        <h4>Beli</h4>
      </div>
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
export default ProductDetailPage;