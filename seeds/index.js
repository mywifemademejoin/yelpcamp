const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

console.log(process.env);

mongoose
	.connect('mongodb://localhost:27017/yelpcamp', {
		useNewUrlParser    : true,
		useUnifiedTopology : true,
		useFindAndModify   : false
	})
	.then(() => console.log('CONNECTED TO MONGODB:', mongoose.connection.port))
	.catch(err => console.log('MONGO CONNECTION ERROR:\n', err));

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async num => {
	let result = 0;
	if (!num) {
		console.log('YOU MUST SPECIFY HOW MANY CITIES TO CREATE!! - index.js 100');
		return result;
	}
	await Campground.deleteMany({});

	for (let i = 0; i < num; i++) {
		const { longitude, latitude, state, city } = sample(cities);
		const camp = new Campground({
			geometry    : {
				type        : 'Point',
				coordinates : [ longitude, latitude ]
			},
			author      : '61e80a7a48110d001626e841',
			title       : `${sample(descriptors)} ${sample(places)}`,
			price       : (Math.floor(Math.random() * 10 ** 4) + 20) / 10 ** 2,
			location    : `${city}, ${state}`,
			description :
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, quas, cum adipisci, sit quam sint excepturi optio fugiat molestiae officiis accusamus. Recusandae dicta in quae adipisci, eaque quisquam nesciunt? Aperiam.',
			images      : [
				{
					//set to default image url
					url      :
						'https://res.cloudinary.com/picklewaffle/image/upload/v1629126217/yelpcamp/cfm1ej4jiq1vdasjec0m.jpg',

					filename : 'yelpcamp/bc94chuhb4s3pgzmrrbs'
				}
			]
		});
		await camp.save();
		result++;
	}
	return result;
};

seedDB(process.argv[2]).then(res => {
	console.log(`CREATED`, res, `CAMPGROUND(S)`);
	console.log(`CLOSING DB CONNECTION:`, mongoose.connection.port);
	mongoose.connection.close();
	process.exit();
});
