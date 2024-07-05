const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
// const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');
const https = require('https')
const fs = require('fs')

app.use(cors());
app.options('*', cors())

require('dotenv/config');

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
// app.use(authJwt());
app.use(errorHandler);

// Routes
const usersRouter = require('./routers/users');
const walletsRouter = require('./routers/wallets');
const contractRouter = require('./routers/contracts');
const tokenRouter = require('./routers/tokens');

const api = process.env.API_URL

app.use(`${api}/users`, usersRouter)
app.use(`${api}/wallets`, walletsRouter)
app.use(`${api}/contracts`, contractRouter)
app.use(`${api}/tokens`, tokenRouter)

// Mongoose
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'catalyst-database'
})
.then(()=>{
    console.log('Database Connection Established ...')
})
.catch((err)=>{
    console.log(err);
});

app.listen(4000, ()=>{
    console.log(api);
    console.log('the server is running on http://localhost:4000')
});

// const sslServer = https.createServer({
//     key: fs.readFileSync('./cert/key.pem'), // (__dirname, 'cert', 'key.pem')
//     cert: fs.readFileSync('./cert/cert.pem'),
//     },
//     app
// )

// sslServer.listen(3434, () => console.log('Secure Server running on port 3434'))