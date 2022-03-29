import { Grid } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router';
import { fireAuth, getTransactionsByCurrentUser } from '../../service';
import './TransactionPage.css';
import Pagination from '@material-ui/lab/Pagination';
import TransactionCard from '../../Components/TransactionCard/TransactionCard';

const TransactionPage = () => {
  const location = useLocation();

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      fireAuth.onAuthStateChanged(async user => {
        if (user) {
          const fetchedCurrentUserTransactions = await getTransactionsByCurrentUser();
          console.log('current user consultations:', fetchedCurrentUserTransactions);
          setTransactions(fetchedCurrentUserTransactions);
        }
      })
    }
    fetchData();
  }, [location, refresh]);

  const renderItemCards = () => {
    return transactions.length > 0 ? (
      <Grid container>
        { transactions[page-1].map(item => {
            return (
              <TransactionCard
                item={item}
              />
            )
        })}
      </Grid>
    ) : (
      <div style={{margin: '40px 0 0 40px'}}>
        <h3>Anda tidak memiliki transaksi sejauh ini</h3>
      </div>
    )
  }

  return (
    <div>
      <div className='transaction-banner-wrapper'>
        <div style={{color: 'black', fontFamily: 'Avenir-Next', fontSize: '64px'}}>
          Riwayat
        </div>
      </div>
      <div style={{padding: '40px 100px'}}>
        {renderItemCards()}
        <div className='pagination-container'>
          <Pagination
            count={Math.ceil(transactions.length)}
            shape="rounded"
            page={page}
            onChange={(event, value) => setPage(value)}
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionPage;