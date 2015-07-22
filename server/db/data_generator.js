var faker = require('faker');

var data = [];

// generate 30 random books
for (var i = 0; i < 30; i++) {
    var book = {
        title: faker.lorem.words().join(' '),
        author: faker.name.findName(),
        author_image: faker.image.avatar(),
        release_date: faker.date.recent(),
        image: faker.image.abstract() + '?_r=' + Math.floor(((new Date()).getTime() * Math.random()) + i),
        price: faker.internet.ip().replace(/\./g, '').substring(0, 3),
        short_description: faker.lorem.sentence(),
        rating: (Math.floor(Math.random() * (5 - 2 + 1)) + 2), // Generate a random number between 2 & 5
        long_description: faker.lorem.paragraph()
    }

    data.push(book);
};

module.exports = data;
