const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(result => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.error("Error: ", error);
    });

const PhonebookEntrySchema = new mongoose.Schema({
    name: String,
    number: String
});

PhonebookEntrySchema.set('toJSON', {
    transform: (document, jsonObject) => {
        jsonObject.id = jsonObject._id.toString();
        delete jsonObject._id;
        delete jsonObject.__v;
    }
})

module.exports = mongoose.model("PhonebookEntry", PhonebookEntrySchema);