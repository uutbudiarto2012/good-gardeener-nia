import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ChatPage from '../../Containers/ChatPage/ChatPage';
import ConsultantDetailPage from '../../Containers/ConsultantDetailPage/ConsultantDetailPage';
import ConsultantPage from '../../Containers/ConsultantPage/ConsultantPage';
import HomePage from '../../Containers/HomePage/HomePage';
import Login from '../../Containers/Login/Login';
import NewsPage from '../../Containers/NewsPage/NewsPage';
import CheckoutPage from '../../Containers/PaymentPage/CheckoutPage';
import PaymentPage from '../../Containers/PaymentPage/PaymentPage';
import ProductDetailPage from '../../Containers/ProductDetailPage/ProductDetailPage';
import Register from '../../Containers/Register/Register';
import SearchPage from '../../Containers/SearchPage/SearchPage';
import TransactionPage from '../../Containers/TransactionPage/TransactionPage';
import PublicRoute from './PublicRoute';

const HomeNavigation = () => {
  return (
    <Switch>
      <Route exact path='/'><Redirect to='/home' /></Route>
      <PublicRoute path='/home' component={HomePage} />
      <PublicRoute path='/product/:id' component={ProductDetailPage} />
      <PublicRoute path='/chekout' component={CheckoutPage} />
      <PublicRoute path='/payment' component={PaymentPage} />
      <PublicRoute path='/product' component={SearchPage} />
      <PublicRoute path='/chat' component={ChatPage} />
      <PublicRoute path='/news' component={NewsPage} />
      <PublicRoute path='/consultant/:id' component={ConsultantDetailPage} />
      <PublicRoute path='/consultant' component={ConsultantPage} />
      <PublicRoute path='/transaction' component={TransactionPage} />
      <PublicRoute path='/login' component={Login} />
      <PublicRoute path='/register' component={Register} />
    </Switch>
  );
};

export default HomeNavigation;