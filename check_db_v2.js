const mongoose = require('mongoose');

async function checkData() {
    const uri = "mongodb+srv://quickhire:quickhire@quickhire-cluster.xlgvdn3.mongodb.net/?appName=QuickHire-Cluster";
    try {
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        const application = await db.collection('applications').findOne({}, { sort: { appliedAt: -1 } });

        console.log("--- LATEST APPLICATION RAW DATA ---");
        console.log(JSON.stringify(application, null, 2));
        console.log("--- KEYS ---");
        console.log(Object.keys(application || {}));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
