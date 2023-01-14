import { Grid } from '@material-ui/core';
import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import './TransactionCard.css';
import { useHistory } from 'react-router-dom';
import { } from '../../service';
import { formattedCurrency } from '../../Constants/format';

const TransactionCard = (props) => {

  const monthIndex = {
    0: 'Januari',
    1: 'Februari',
    2: 'Maret',
    3: 'April',
    4: 'Mei',
    5: 'Juni',
    6: 'Juli',
    7: 'Augustus',
    8: 'September',
    9: 'Oktober',
    10: 'November',
    11: 'Desember'
  }
  const {
    item: {
      type,
      rating = 4.9,
      total_harga: price,
      tanggal: date
    }
  } = props;

  const history = useHistory();


  const formatDate = new Date(date)
  const day = formatDate.getDate()
  const month = formatDate.getMonth()
  const year = formatDate.getFullYear()

  console.log({ day, month, year })
  const renderConsultantTransactionCard = () => {
    const { konsultan: { picture: image, nama: name } } = props.item;
    return (
      <Grid item xs={9}>
        <div className='transaction-card'>
          <div className='restrict-height'>
            <Grid container>
              <Grid xs={9}>
                <div style={{ display: 'flex', marginBottom: '40px', padding: '0 40px' }}>
                  <img
                    src={image || require('../../Assets/images/logo-bw.png')}
                    className={image ? 'image-thumbnail' : 'transaction-detail-image-empty'}
                    alt=''
                  />
                  <div style={{ marginLeft: '20px' }}>
                    <div style={{ color: '#9A9A9A', justifyContent: 'center', marginTop: '30px' }}>
                      Konsultasi
                    </div>
                    <div style={{ display: 'flex' }}>
                      <h2>{name}</h2>
                      <div className='transaction-rating'>
                        <StarIcon style={{ color: '#FFC107' }} />
                        {`${rating}/5`}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid xs={3}>
                <p style={{ color: '#9A9A9A', justifyContent: 'center' }}>
                  {`${day} ${monthIndex[month]} ${year}`}
                </p>
                <div className='transaction-price'>
                  {formattedCurrency(price)}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>
    )
  }

  const renderProductTransactionCard = () => {
    const { barang: { picture: image, nama: name } } = props.item;
    return (
      <Grid item xs={9}>
        <div className='transaction-card'>
          <Grid container>
            <Grid xs={9}>
              <div style={{ display: 'flex', marginBottom: '40px', padding: '0 40px' }}>
                <img
                  src={image || require('../../Assets/images/logo-bw.png')}
                  className={image ? 'image-thumbnail' : 'transaction-detail-image-empty'}
                  alt=''
                />
                <div style={{ marginLeft: '20px' }}>
                  <div style={{ color: '#9A9A9A', justifyContent: 'center', marginTop: '30px' }}>
                    Produk
                  </div>
                  <div style={{ display: 'flex' }}>
                    <h2>{name}</h2>
                    <div className='transaction-rating'>
                      <StarIcon style={{ color: '#FFC107' }} />
                      {`${rating}/5`}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid xs={3}>
              <p style={{ color: '#9A9A9A', justifyContent: 'center' }}>
                {`${day} ${monthIndex[month]} ${year}`}
              </p>
              <div className='transaction-price'>
                {formattedCurrency(price)}
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    )
  }

  return type === 'consultation' ? renderConsultantTransactionCard() : renderProductTransactionCard()
}

export default TransactionCard;