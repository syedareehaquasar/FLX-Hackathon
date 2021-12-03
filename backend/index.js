import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import customerRoutes from './routes/customer.js';
import customerAuthRoutes from './routes/customerAuth.js';
import passwordResetRoutes from './routes/passwordReset.js';
import reviewRoutes from './routes/review.js';

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

app.use('/customer', customerRoutes);
app.use('/customerAuth', customerAuthRoutes);
app.use('/passwordReset', passwordResetRoutes);
app.use('/review', reviewRoutes);

mongoose.connect(CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));


app.get('/', (req, res) => {
    res.send("Welcome to Homie System!");
});