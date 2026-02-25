const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://vickyraw201_db_user:eJz2W4oE2z4bkaAJ@agrimate.lfwkrs8.mongodb.net/?appName=Agrimate')
    .then(async () => {
        try {
            const user = new User({
                name: 'Test Setup',
                email: 'test_setup_' + Date.now() + '@gmail.com',
                googleId: '123456789',
                provider: 'google'
            });
            await user.save();
            console.log('Saved successfully');
        } catch (e) {
            console.error('MONGO ERR:', e.message);
            console.error(e);
        }
        process.exit(0);
    });
