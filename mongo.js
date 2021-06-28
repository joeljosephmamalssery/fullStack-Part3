const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];
let contacts = [];
const url = `mongodb+srv://joel:${password}@cluster0.ubqk5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

if (process.argv.length < 4) {
  Contact.find({}).then((result) => {
    contacts = result;
    console.log('Phonebook');
    contacts.forEach((contact) => {
      console.log(contact.name, contact.number);
    });
    mongoose.connection.close();
  });
} else {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log('contact saved!');
    mongoose.connection.close();
  });
}
