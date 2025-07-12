const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

module.exports = {
    doAdminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            console.log('Looking for admin with email:', adminData.email);
            const admin = await Admin.findOne({
                email: adminData.email
            })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {
                    if (status) {
                        response.admin = admin;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    }
}; 