const mongoose = require('mongoose');

// Use a dynamic import or require with the absolute path to the model if possible, 
// but for a quick check, let's just use the connection string from env and raw mongo.

async function checkData() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI not found");
        return;
    }

    try {
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        const applications = await db.collection('applications').find().sort({ appliedAt: -1 }).limit(5).toArray();

        console.log("Last 5 applications:");
        applications.forEach(app => {
            console.log(`ID: ${app._id}, Name: ${app.candidateName}`);
            console.log(`  Major: ${app.major}`);
            console.log(`  Github: ${app.githubUrl}`);
            console.log('---');
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
