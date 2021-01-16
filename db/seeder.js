const seeder = require('mongoose-seed');
const https = require('https');
const db = "mongodb://localhost/nearby-transit";

const transitOptions = [
  'Metro',
  'Bus',
  'bike path',
  'freeway'
]

const getRandomWords = () => {

  return new Promise((resolve, reject) => {

    https.get('https://hipsum.co/api/?type=hipster-centric&sentences=3', res => {

      res.setEncoding("utf8");
      res.on('data', data => {
        resolve(data);

      })
    })
  })
};

const generateRandomIndex = (max) => {
  return Math.floor(Math.random() * max);
}

const getTransit = (id, type, name) => {
  return {
    _id: id,
    type: type,
    name: name
  }
}


const seedData = (data) => {

  seeder.connect(db, () => {

    seeder.loadModels(['./db/index.js']);

    seeder.clearModels(['nearby-transit'], () => {

      seeder.populateModels(data, () => {

        seeder.disconnect();

      })
    })
  })
}


getRandomWords()
  .then(words => {

    const collection = words.split(' ')
    collection.pop();
    collection.shift()

    let seedingData = [
      {
        'model': 'nearby-transit',
        'documents': []
      }

    ]

    for (let i = 0; i < 100; i++) {
      const option = getTransit(i, transitOptions[generateRandomIndex(transitOptions.length)], collection[generateRandomIndex(collection.length)]);
      seedingData[0].documents.push(option);
    }

    seedData(seedingData);

  })