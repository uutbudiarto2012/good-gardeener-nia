DROP TABLE klien CASCADE;
DROP TABLE barang CASCADE;
DROP TABLE transaksi_barang CASCADE;
DROP TABLE konsultan CASCADE;
DROP TABLE transaksi_konsultasi CASCADE;
DROP TABLE chat CASCADE;

CREATE TABLE IF NOT EXISTS klien (
  "id" SERIAL PRIMARY KEY, 
  nama TEXT NOT NULL,
  alamat TEXT,
  email TEXT NOT NULL,
  picture TEXT
);

CREATE TABLE IF NOT EXISTS barang (
  "id" SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  harga INT NOT NULL,
  stok INT NOT NULL,
  kategori TEXT,
  deskripsi TEXT,
  picture TEXT
);

CREATE TABLE IF NOT EXISTS transaksi_barang (
  "id" SERIAL PRIMARY KEY,
  klien_id INT REFERENCES klien("id"),
  barang_id INT REFERENCES barang("id"),
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  harga INT NOT NULL,
  qty INT NOT NULL,
  total_harga INT NOT NULL
);

CREATE TABLE IF NOT EXISTS konsultan (
  "id" SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  harga INT NOT NULL,
  picture TEXT,
  pendidikan TEXT,
  pengalaman TEXT
);

CREATE TABLE IF NOT EXISTS transaksi_konsultasi (
  "id" SERIAL PRIMARY KEY,
  klien_id INT REFERENCES klien("id"),
  konsultan_id INT REFERENCES konsultan("id"),
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  harga INT NOT NULL,
  qty INT NOT NULL,
  total_harga INT NOT NULL
);

CREATE TABLE IF NOT EXISTS chat (
  "id" SERIAL PRIMARY KEY,
  klien_id INT REFERENCES klien("id"),
  konsultan_id INT REFERENCES konsultan("id"),
  pesan TEXT NOT NULL
);

INSERT INTO klien (nama, alamat, email) VALUES
  ('Arifin', 'Jakarta', 'arifin@goodgardener.com'),
  ('Maria', 'Jakarta', 'maria@goodgardener.com'),
  ('Jones', 'Jakarta', 'jones@goodgardener.com');

INSERT INTO barang (nama, harga, stok, kategori, picture, deskripsi) VALUES
  ('Pestisida Tanaman Obat Hama Kutu Putih Obat', 60000, 5, 'pestisida',
  'https://images.tokopedia.net/img/cache/900/product-1/2020/8/27/83777980/83777980_981f0e8f-de39-4d8c-ba7b-19020902a542_2000_2000',
  'Pestisida tanaman obat hama kutu putih obat hama tanaman spray 500 ml diracik dengan bahan baku yang mampu membunuh hama tanaman seperti ulat, kutu putih, tungau dan kaki seribu.
  
  Pestisida tanaman obat hama kutu putih obat hama tanaman spray 500 ml ready to use. Bisa langsung disemprotkan ke tanaman hias tanpa perlu tambahan lainnya. Semprotkan pada tanaman yang terserang hama. Gampang banget kan ka cara memakainya?'),
  
  ('Pestisida Tanaman Obat Hama Kutu Putih/PHEFO HCS Organik', 47000, 10, 'pestisida',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/12/16/1e35aee2-8340-41b2-a6b6-1ddd8387e930.jpg',
  'Pusing tanaman anda terserang hama..!!!
  Ingin membasminya tapi takut keracunan bahan kimia atau anda ingin tanaman anda bebas dari insektisida atau Pestisida Kimia..!!
  
  Ini dia solusinya, sebut saja ANTILAT Pestisida Organik yang di Formulasikan khusus untuk berbagai serangan hama yang menganggu tanaman anda.'),
  
  ('Paket Skincare Kilap Daun Leafshine Pupuk Tanaman', 142000, 3, 'pestisida',
  'https://images.tokopedia.net/img/cache/900/VqbcmM/2020/9/9/030f722b-9e93-4786-ac65-2936e84108ca.jpg',
  'Paket Skincare Tanaman Kilap Daun Leafshine Pupuk Tanaman Hias Pestisida Anti Hama terdiri dari 

  - Kilap daun Leafhsine Tanaman Oles 100 ml Aman untuk tanaman
  - Pupuk Daun Tanaman Hias Spray Ready to use udah included botol 500 ml
  - Pestisida Anti Hama Spray Ready to use udah included botol 500 ml'
  );

INSERT INTO konsultan (nama, email, harga, picture, pendidikan, pengalaman) VALUES
  ('Will Setiawan', 'willysetiawan@goodgardener.com', 15000,
  'https://images.pexels.com/photos/5027614/pexels-photo-5027614.jpeg?cs=srgb&dl=pexels-anna-shvets-5027614.jpg&fm=jpg',
  'S1 Pertanian', 'Memiliki lahan pertanian di Sidoarjo'),

  ('Muhammad Trinadi', 'muhammadtrinadi@goodgardener.com', 15000,
  'https://images.pexels.com/photos/7728361/pexels-photo-7728361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'S1 Pertanian', 'Memiliki lahan pertanian di Sidoarjo'),

  ('Steven', 'steven@goodgardener.com', 15000,
  'https://images.pexels.com/photos/162564/gardener-worker-gardening-machinery-162564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'S1 Pertanian', 'Memiliki lahan pertanian di Sidoarjo');

INSERT INTO transaksi_konsultasi (klien_id, konsultan_id, harga, qty, total_harga) VALUES
  (1, 1, 15000, 1, 15000),
  (1, 2, 15000, 1, 15000),
  (1, 3, 15000, 1, 15000);

INSERT INTO transaksi_barang (klien_id, barang_id, harga, qty, total_harga) VALUES
  (1, 1, 60000, 3, 180000);