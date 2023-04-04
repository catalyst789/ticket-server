const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL).then((error, client) => {
    console.log("DB connected..!")
}).catch((err) => {
    console.log("Error connecting DB", err);
})