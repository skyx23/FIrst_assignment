const MongoClient = require('mongodb').MongoClient;
const md5 = require('md5');

const url =
  'mongodb+srv://admin:7blQQYL6MrnIenru@project1.mz5o4.mongodb.net/user?retryWrites=true&w=majority';

let data = [
  {
    first_name: 'Robert',
    last_name: 'Schwartz',
    email: 'rob23@gmail.com',
    password: 'robert',
    mobile_no: 1234567891,
    dob: '01/01/2001',
    age: 20,
  },
  {
    first_name: 'Lucy',
    last_name: 'Ballmer',
    email: 'lucyb56@gmail.com',
    password: 'lucy',
    mobile_no: 1234567892,
    dob: '01/01/1995',
    age: 26,
  },
  {
    first_name: 'Anna',
    last_name: 'Smith',
    email: 'annasmith23@gmail.com',
    password: 'anna',
    mobile_no: 1234567893,
    dob: '01/01/1993',
    age: 28,
  },
  {
    first_name: 'Robert',
    last_name: 'Brown',
    email: 'bobbrown432@yahoo.com',
    password: 'robert',
    mobile_no: 1234567894,
    dob: '01/01/2005',
    age: 16,
  },
  {
    first_name: 'Roger',
    last_name: 'Bacon',
    email: 'rogerbacon12@yahoo.com',
    password: 'roger',
    mobile_no: 1234567895,
    dob: '01/01/1997',
    age: 24,
  },
];
console.log('Development')

async function task() {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('connected');
  const db = client.db('user');
  const users = db.collection('users');
  const userProfile = db.collection('user-profile');

  await users.deleteMany();
  await userProfile.deleteMany();

  var id = [];

  for (x in data) {
    await users
      .insertOne({
        'first Name': data[x].first_name,
        'last Name': data[x].last_name,
        email: data[x].email,
        password: md5(data[x].password),
      })
      .then((result) => {
        id.push(result.ops[0]._id);
      });
  }

  for (x in data) {
    await userProfile.insertOne({
      id: id[x],
      'mob no': data[x].mobile_no,
      dob: data[x].dob,
      age: data[x].age,
    });
  }

  const a = await userProfile.find({}).toArray();
  var sum = 0
  for (x in a ){
      sum = sum + a[x].age
  }

  var avg = sum/a.length
  console.log(avg);

  const b = await userProfile.find({age:{$gt : 25}}).toArray();
  console.log(b);

  for (x in b ){
      userProfile.deleteOne({_id : b[x]._id})
      users.deleteOne({_id : b[x].id })
  }

}

task();
