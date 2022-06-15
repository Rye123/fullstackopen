const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.error("Provide password as argument!");
    process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);
const uri = `mongodb+srv://fullstackopen:${password}@cluster0.0srpedb.mongodb.net/FSO_phonebook?retryWrites=true&w=majority`;

const phonebookEntrySchema = new mongoose.Schema({
    name: String,
    number: String
});

const PhonebookEntry = mongoose.model("PhonebookEntry", phonebookEntrySchema);

if (process.argv.length < 5) {
    mongoose
        .connect(uri)
        .then(() => {
            PhonebookEntry.find({}).then(result => {
                console.log("phonebook: ");
                result.forEach(entry => {
                    console.log(entry.name, entry.number);
                })
                mongoose.connection.close();
            })
        })
} else {
    const newEntry = new PhonebookEntry({
        name: process.argv[3],
        number: process.argv[4]
    });
    mongoose
        .connect(uri)
        .then(() => {
            newEntry.save().then(result => {
                console.log(`added ${newEntry.name} number ${newEntry.number} to phonebook`);
                mongoose.connection.close();
            });
        });
}
