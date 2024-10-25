import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		await mongoose.connect('mongodb+srv://ujjwalmaurya662:hGZfQEgx9E3RFOG2@cluster0.2142v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
		console.log('db Connect');
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
		process.exit(1);
	}
};
