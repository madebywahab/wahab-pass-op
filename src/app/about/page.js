import clientPromise from "@/lib/mongodb";

export default async function About() {
  let dbMessage = "Database connection failed";

  try {
    const client = await clientPromise; // Connect to MongoDB
    const db = client.db(); // Default database
    // Just try to list collections to test connection
    await db.listCollections().toArray();
    dbMessage = "Database is connected!";
  } catch (err) {
    console.error("DB connection error:", err);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">About Page</h1>
      <p>{dbMessage}</p>
      <p>MONGODB_URI: {process.env.MONGODB_URI}</p>
    </div>
  );
}
