const pkAuth = new (require('./index.js'))('curve25519')

const sqlite3=require('sqlite3').verbose();
const db=new sqlite3.Database(':memory:');
const database=(sql,data=[],callback=()=>{}) => {db.all(sql, data, callback);};

database(`CREATE TABLE IF NOT EXISTS creds (id INTEGER PRIMARY KEY AUTOINCREMENT,public_key TEXT,revocation_certificate TEXT);`, [], (err) => {if (err) {console.log(err)}})

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/register', async (req, res) => {
  const keys = await pkAuth.generateKeyPair()
  console.log(await pkAuth.encryptPrivateKey(keys.privateKey, 'abc123#'))
  database('INSERT INTO creds (public_key,revocation_certificate) VALUES (?,?)', [keys.publicKey, keys.revocationCertificate])
  res.json(keys)
})

app.post('/login', async (req, res) => {
  const privateKey = req.body.privateKey;
  const publicKey = (await pkAuth.generatePublic(privateKey)).publicKey;

  database('SELECT * FROM creds WHERE public_key = ?', [publicKey], (err, rows) => {
    res.json(rows.length === 1 ? {success: true,user: rows[0]} : {success: false,error: 'Public key does\'nt exist'})
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})