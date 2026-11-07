import mongoose from 'mongoose';

const url = 'mongodb+srv://' + process.env.db_user + ':' +  process.env.db_password + '@' + process.env.mongo_url
const connectDB = async () => {
    try {
        await mongoose.connect(url, {
           
        });
        console.log('Database is connected');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

export default connectDB;
