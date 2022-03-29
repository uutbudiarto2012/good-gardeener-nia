import { Grid } from '@material-ui/core';
import React from 'react';
import { formattedCurrency } from '../../Constants/format';
import './ItemCard.css';
import { useHistory } from 'react-router-dom';
import {} from '../../service';

const ItemCard = (props) => {
  const {
    image,
    title,
    price,
    productId
  } = props;

  const history = useHistory();

  const handleClick = async () => {
    history.push(`/product/${productId}`);
  }

  return (
    <Grid item xs={3}>
      <div className='item-card' onClick={() => handleClick()}>
        <div className='item-image'>
          <img
            src={image || require('../../Assets/images/logo-bw.png')}
            className={image ? 'image-thumbnail' : 'image-thumbnail-empty'}
            alt=''
          />
        </div>
        <div className='item-content'>
          <div className='item-title'>{title}</div>
          <div className='item-price'>{formattedCurrency(price)}</div>
        </div>
      </div>
    </Grid>
  )
}

export default ItemCard;