import mongoose from 'mongoose'; // Change require to import

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // stop the server if DB fails
    }
};

export default connectDB; // Change module.exports to export default