import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️  MONGO_URI not set. Skipping MongoDB connection.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Atlas Connected Successfully!");

    // Clean up old indexes
    try {
      const db = mongoose.connection.db;
      if (db) {
        const usersCollection = db.collection("users");
        
        // Try to drop known problematic indexes
        const indexesToDrop = ["fullname_1", "name_1", "fullname"];
        for (const indexName of indexesToDrop) {
          try {
            await usersCollection.dropIndex(indexName);
            console.log(`✅ Dropped old ${indexName} index`);
          } catch (err) {
            // Index doesn't exist, which is fine
          }
        }
      }
    } catch (indexErr) {
      // Silently fail if index operations don't work
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
