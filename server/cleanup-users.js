const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String }, { timestamps: true });
const User = mongoose.model("User", userSchema);

const messageSchema = new mongoose.Schema({ sender: mongoose.Types.ObjectId, receiver: mongoose.Types.ObjectId, message: String }, { timestamps: true });
const Message = mongoose.model("Message", messageSchema);

async function cleanupDuplicates() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const allUsers = await User.find({}).sort({ createdAt: 1 }).lean();
  console.log(`Total users before cleanup: ${allUsers.length}`);
  
  const emailMap = {};
  const toDelete = [];
  
  for (const user of allUsers) {
    const email = user.email.toLowerCase();
    if (!emailMap[email]) {
      emailMap[email] = user._id;
      console.log(`  KEEP: ${user.name} <${email}> (${user._id})`);
    } else {
      toDelete.push(user._id);
      console.log(`  DELETE duplicate: ${user.name} <${email}> (${user._id})`);
    }
  }

  if (toDelete.length === 0) {
    console.log("\nNo duplicates found. Nothing to clean up.");
    await mongoose.disconnect();
    return;
  }

  const msgResult = await Message.deleteMany({
    $or: [{ sender: { $in: toDelete } }, { receiver: { $in: toDelete } }]
  });
  console.log(`\nDeleted ${msgResult.deletedCount} orphaned messages.`);

  const userResult = await User.deleteMany({ _id: { $in: toDelete } });
  console.log(`Deleted ${userResult.deletedCount} duplicate users.`);

  const remaining = await User.countDocuments();
  console.log(`\nTotal users after cleanup: ${remaining}`);
  
  await mongoose.disconnect();
  console.log("Done. Reconnect your server and refresh the client.");
}

cleanupDuplicates().catch(console.error);
