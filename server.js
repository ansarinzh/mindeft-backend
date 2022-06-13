const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors =  require('cors');
const router = require('./Routes/routes');
require('dotenv/config');


app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use('/api', router)


const PORT =process.env.PORT || 3000;

// Connect to mongodb with mongoose
mongoose.connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'mind',
}).then(() => {
    console.log('Database Connection is ready...');
})
.catch((err) => {
    console.log(err);
});


app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`);
});
