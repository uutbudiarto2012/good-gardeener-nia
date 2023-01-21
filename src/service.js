import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig, newsApiConfig, supabaseConfig } from './env';
import { createClient } from '@supabase/supabase-js'
import axios from 'axios';
import moment from 'moment';

firebase.initializeApp(firebaseConfig);
export const fireAuth = firebase.auth();

const supabase = createClient(supabaseConfig.url, supabaseConfig.key)

export const signUp = async (email, password, userData, userRole) => {
  fireAuth.createUserWithEmailAndPassword(email, password)
    .then(async data => {
      userData = await createUser({ ...userData, email }, userRole);
      console.log('SUCCESS SIGN UP');
    })
    .catch(error => console.log('FAILED SIGNUP'));
  return userData;
}

export const signIn = async (email, password) => {
  let userData = {};
  fireAuth.signInWithEmailAndPassword(email, password)
    .then(async () => {
      userData = await getUserByEmail(email);
      console.log('SUCCESS SIGN IN');
    })
    .catch(error => console.log('FAILED SIGNIN'))
  return userData;
}

export const signOut = async () => {
  fireAuth.signOut();
}

export const fetchCurrentUser = async () => {
  const isLoggedIn = fireAuth.currentUser;
  console.log('isLoggedIn:', isLoggedIn);
  return !!isLoggedIn ? await getUserByEmail(isLoggedIn.email) : null;
}

export const getUserByEmail = async (email) => {
  const userRole = await getUserRole(email);
  let userData = {}
  if (userRole === 'client') {
    userData = await getClientByEmail(email);
  } else {
    userData = await getConsultantByEmail(email);
  }

  return { ...userData, role: userRole }
}

export const createUser = async (userData, userRole) => {
  const { data: users } = await supabase
    .from(userRole === 'client' ? 'klien' : 'konsultan')
    .insert([
      userData,
    ])

  return users[0];
}

export const getAllProducts = async () => {

  let { data: barang } = await supabase
    .from('barang')
    .select('*')

  let groupedProducts = []

  while (barang.length > 0) {
    groupedProducts.push(barang.splice(0, 20))
  }

  return groupedProducts;
}

export const getProductsByTitle = async (searchString) => {
  let { data: barang } = await supabase
    .from('barang')
    .select('*')
    .ilike('nama', `%${searchString}%`)

  let groupedProducts = []

  while (barang.length > 0) {
    groupedProducts.push(barang.splice(0, 20))
  }

  return groupedProducts;
}

export const getProductById = async (productId) => {
  let { data: barang } = await supabase
    .from('barang')
    .select('*')
    .eq('id', productId)

  return barang[0];
}

export const getUserRole = async (userEmail) => {
  let { data: clients } = await supabase
    .from('klien')
    .select('*')
    .eq('email', userEmail)

  return clients.length > 0 ? 'client' : 'consultant';
}

export const getClientByEmail = async (email) => {
  let { data: clients } = await supabase
    .from('klien')
    .select('*')
    .eq('email', email)

  return clients[0];
}

export const getConsultantsByName = async (searchString) => {
  let { data: consultants } = await supabase
    .from('konsultan')
    .select('*')
    .ilike('nama', `%${searchString}%`)

  let groupedProducts = []

  while (consultants.length > 0) {
    groupedProducts.push(consultants.splice(0, 20))
  }

  return groupedProducts;
}

export const getConsultantByEmail = async (email) => {
  let { data: consultants } = await supabase
    .from('konsultan')
    .select('*')
    .eq('email', email)

  return consultants[0];
}

export const getAllConsultants = async () => {
  let { data: consultants } = await supabase
    .from('konsultan')
    .select('*')

  let groupedProducts = []

  while (consultants.length > 0) {
    groupedProducts.push(consultants.splice(0, 20))
  }

  return groupedProducts;
}

export const getConsultantById = async (id) => {
  let { data: consultants } = await supabase
    .from('konsultan')
    .select('*')
    .eq('id', id)

  return consultants[0];
}

export const getClientListByConsultantId = async (consultantId) => {
  let { data: clients } = await supabase
    .from('chat')
    .select(`
    klien (
      id,
      nama,
      picture
    ),
    pesan
  `)
    .eq('konsultan_id', consultantId)
    .order('id', { ascending: false })

  let clientNames = {}

  clients.forEach(client => {
    const { klien: { id, nama, picture }, pesan: message } = client;
    if (!(nama in clientNames)) {
      clientNames[nama] = { id, picture, message };
    }
  })

  const clientList = []

  for (const client in clientNames) {
    clientList.push({ ...clientNames[client], name: client })
  }

  return clientList;
}

export const getConsultationChat = async (clientId, consultantId) => {
  let { data: chats } = await supabase
    .from('chat')
    .select(`
    pesan,
    klien (
      nama
    ),
    konsultan (
      nama
    ),
    pengirim
  `)
    .eq('klien_id', clientId)
    .eq('konsultan_id', consultantId)
    .order('id', { ascending: true })

  console.log(chats);

  return chats;
}

export const sendChat = async (message, sender, clientId, consultantId) => {
  let { data: chat } = await supabase
    .from('chat')
    .insert([
      {
        klien_id: clientId,
        konsultan_id: consultantId,
        pesan: message,
        pengirim: sender
      }
    ]);

  return chat;
}

export const getProductTransactionByClientId = async (clientId) => {
  let { data: productTransactions } = await supabase
    .from('transaksi_barang')
    .select('*')
    .eq('klien_id', clientId)

  return productTransactions
}

export const getProductTransactionByCurrentUser = async () => {
  const currentUser = await fetchCurrentUser();
  console.log(currentUser);
  if (!!!currentUser) return null;

  let { data: productTransaction } = await supabase
    .from('transaksi_barang')
    .select(`
    barang (
      id,
      nama,
      picture
    ),
    tanggal,
    qty,
    total_harga
  `)
    .eq('klien_id', currentUser.id)

  productTransaction = productTransaction.map(product => { return { ...product, type: 'product' } });

  return productTransaction
}

export const getConsultationTransactionByClientId = async (clientId) => {
  let { data: consultationTransactions } = await supabase
    .from('transaksi_konsultasi')
    .select('*')
    .eq('klien_id', clientId)

  return consultationTransactions
}

export const getConsultationTransactionByCurrentUser = async () => {
  const currentUser = await fetchCurrentUser();
  console.log(currentUser);
  if (!!!currentUser) return null;

  let { data: consultationTransactions } = await supabase
    .from('transaksi_konsultasi')
    .select(`
    konsultan (
      id,
      nama,
      picture
    ),
    tanggal,
    qty,
    total_harga
  `)
    .eq('klien_id', currentUser.id)

  consultationTransactions = consultationTransactions.map(consultation => { return { ...consultation, type: 'consultation' } });

  return consultationTransactions
}

export const getTransactionsByCurrentUser = async () => {
  const consultationTransactions = await getConsultationTransactionByCurrentUser();
  const productTransactions = await getProductTransactionByCurrentUser();
  const transactions = [...consultationTransactions, ...productTransactions]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  let groupedTransactions = []

  while (transactions.length > 0) {
    groupedTransactions.push(transactions.splice(0, 20))
  }

  return groupedTransactions;

}

export const purchaseProduct = async (clientId, productId, price, qty, stock) => {
  const { data: productTransactions } = await supabase
    .from('transaksi_barang')
    .insert([
      {
        klien_id: clientId,
        barang_id: productId,
        harga: price,
        qty,
        total_harga: price * qty
      },
    ])

  const { data } = await supabase
    .from('barang')
    .update({
      stok: stock - qty
    })
    .eq('id', productId)

  return productTransactions[0];
}

export const getNews = async (query) => {
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiConfig.key}&sortBy=popularity&pageSize=100`
  const response = await axios.get(url)
  const data = response.data

  const articles = data.articles

  return articles;
}

export const startNewConsultation = async (clientId, consultantId, price) => {
  const { data: clientData } = await supabase
    .from('klien')
    .update([
      {
        konsultasi_terakhir: moment().add(1, 'hours')
      },
    ])
    .eq('id', clientId)

  const { data: consultationData, error } = await supabase
    .from('transaksi_konsultasi')
    .insert([
      {
        klien_id: clientId,
        konsultan_id: consultantId,
        tanggal: moment(),
        harga: price,
        qty: 1,
        total_harga: price
      },
    ])

  return { clientData, consultationData }
}

export const getLatestConsultationByClientId = async (clientId) => {
  const { data: latestConsultation } = await supabase
    .from('transaksi_konsultasi')
    .select(`
    id,
    klien_id,
    konsultan_id,
    tanggal
  `)
    .eq('klien_id', clientId)
    .order('tanggal', { ascending: false })

  console.log(latestConsultation)

  return latestConsultation.length > 0 ? latestConsultation[0] : null
}