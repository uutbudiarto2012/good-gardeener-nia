import {
  Grid,
  makeStyles
} from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { useHistory, useLocation } from 'react-router';
import { getAllProducts, getProductsByTitle } from '../../service';
import qs from 'query-string';
import './SearchPage.css';
import Pagination from '@material-ui/lab/Pagination';
import ItemCard from '../../Components/ItemCard/ItemCard';
import SearchBar from '../../Components/SearchBar/SearchBar';

var _ = require('lodash');

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const SearchPage = () => {
  const history = useHistory();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);

  const queries = qs.parse(location.search);

  const searchQuery = queries.query;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = _.isEmpty(queries) ? 
        await getAllProducts() : await getProductsByTitle(queries.query);

      setItems(fetchedItems);
    }
    fetchData();
  }, [location, refresh]);

  const renderItemCards = () => {
    return items.length > 0 ? (
      <Grid container>
        { items[page-1].map(item => {
            const { picture, nama, harga, rating=4.8, id} = item;
            return (
              <ItemCard
                image={picture}
                title={nama}
                price={harga}
                rating={rating}
                productId={id}
              />
            )
        })}
      </Grid>
    ) : (
      <div style={{margin: '40px 0 0 40px'}}>
        <h3>Tidak menemukan produk yang anda cari</h3>
      </div>
    )
  }

  const handleSearch = (searchString) => {
    history.push({
      search: `?query=${searchString.replace('&', '%26')}`,
      pathname: '/product/'
    });
  }

  return (
    <div>
      <div className='search-banner-wrapper'>
        <div style={{color: 'black', fontFamily: 'Avenir-Next', fontSize: '64px'}}>
          Produk
        </div>
        <p style={{color: 'black', fontSize: '18px'}}>
          Temukan produk menarik untuk menemani kegiatan berkebunmu
        </p>
      </div>
      <div style={{padding: '40px 100px'}}>
        <Grid container>
          <Grid item xs={6}>
            <div style={{marginBottom: '40px'}}>
              <SearchBar handleSearch={(value) => handleSearch(value)}/>
            </div>
          </Grid>
          <Grid item xs={6}>
          </Grid>
          <Grid item xs={8}>
            {
              !!searchQuery &&
              <p style={{margin: '60px 0 0 20px'}}>
                Menampilkan hasil pencarian untuk <span style={{color: '#57946C'}}>{`"${searchQuery}"`}</span>
              </p>
            }
          </Grid>
        </Grid>
        {renderItemCards()}
        <div className='pagination-container'>
          <Pagination
            count={Math.ceil(items.length)}
            shape="rounded"
            page={page}
            onChange={(event, value) => setPage(value)}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchPage;