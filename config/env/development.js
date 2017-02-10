'use strict';

module.exports = {
	db: {
		URL: "mongodb://localhost/fileStroage",
		options: {
			user: '',
			pass: ''
		}
	},

	server: {
		PORT: 3000
	},
	admin: {
		email: 'admin@gmail.com',
		password: '123456'
	},
    image_extensions : {
      'image/jpeg' : '.jpg',
      'image/jpg' : '.jpg',
      'image/png' : '.png',
      'image/gif' : '.gif'
    },	
    image_destination: 'public/assets/img/uploads',
    secret: '876sdf&%&^435345(*^&^654sdsdc&^&kjsdfjbksdureyy3(&(*&(&7$%^#%#&^*(&)*)*' 	
};