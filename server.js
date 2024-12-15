
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
//import { response_200 } from './src/utils/responseCodes.js'; no such file
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api/auth', authRoutes);


//app.get('/', (req, res) => response_200(res, 'Server is running'));
//changes here because ./src/utils/responseCodes.js does not exist
app.get('/', (req, res) => res.status(200).json({ message: 'Server is running' }));

app.listen(port, () =>
    console.log(`🚀 Server running on port http://localhost:${port}/`)
);