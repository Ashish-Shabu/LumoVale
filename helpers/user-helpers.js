const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports= {
    doSignup: async (userData) =>{
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User already exists');
        };

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new User({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: hashedPassword
        });

        await newUser.save();
        return newUser;

    },

    dologin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            const user = await User.findOne({
                email: userData.email
            })
            if(user){
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }else {
                        resolve({status:false})
                    }
                })
            }else {
                resolve({status:false})
            }
        })
    }
}
