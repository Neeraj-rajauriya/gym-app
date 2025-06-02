import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB is connected");
  } catch (err) {
    console.log("Error while Connecting to Db", err.message);
  }
};
