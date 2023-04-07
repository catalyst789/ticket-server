require('dotenv').config();
const express = require('express');
const app = express();

app.use(require('cors')());
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// db config
require('./config/database'); 


app.use('/', require('./api/routes/TicketRouter'));



app.listen(process.env.PORT, console.log(`Server is listening at PORT: ${process.env.PORT}`));