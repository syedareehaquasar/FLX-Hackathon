import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import buyerRoutes from './routes/buyer.js';
import customerAuthRoutes from './routes/customerAuth.js';
import sellerRoutes from './routes/seller.js';
import sellerAuthRoutes from './routes/sellerAuth.js';
import deliveryRoutes from './routes/delivery.js';
import deliveryAuthRoutes from './routes/deliveryAuth.js';
import passwordResetRoutes from './routes/passwordReset.js';
import reviewRoutes from './routes/review.js';

const app = express();

dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

app.use('/buyer', buyerRoutes);
app.use('/customerAuth', customerAuthRoutes);
app.use('/seller', sellerRoutes);
app.use('/sellerAuth', sellerAuthRoutes);
app.use('/delivery', deliveryRoutes);
app.use('/deliveryAuth', deliveryAuthRoutes);
app.use('/passwordReset', passwordResetRoutes);
app.use('/review', reviewRoutes);

mongoose.connect(CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));


app.get('/', (req, res) => {
    res.send("Welcome to B2C System!");
});