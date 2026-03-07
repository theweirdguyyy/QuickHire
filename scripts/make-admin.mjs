/**
 * Run this once to promote a user to admin:
 *   node scripts/make-admin.mjs your@email.com
 */
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const email = process.argv[2];
if (!email) {
    console.error("Usage: node scripts/make-admin.mjs <email>");
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    role: { type: String, enum: ["applicant", "employer", "admin"], default: "applicant" },
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

await mongoose.connect(process.env.MONGODB_URI);
const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
if (!user) {
    console.error(`No user found with email: ${email}`);
} else {
    console.log(`✅ ${user.name} (${user.email}) is now an admin.`);
}
await mongoose.disconnect();
