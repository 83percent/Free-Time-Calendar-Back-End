const UserModel = require('../Model/UserModel');


async function login(email, password) {
    try {
        const user = await UserModel.findOne({email: email}, ['name']);
        if(!user) {return null} // 등록된 회원 없음
        else return user.password == password;
    } catch(err) {console.log(err); return 'error';}
}

async function get(id) {
    try {
        const user = await UserModel.findById(id, ['name']);
        if(!user) {return null} // 등록된 회원 없음
        else {
            return {email: user.email, name: user.name};
        }
    } catch(err) {console.log(err); return 'error';}
}

async function set(data) {
    try {
        let user = await UserModel.findOne({email: data.email});
        if(user._id) return false; // 이미 존재하는 아이디
        else {
           user = new UserModel({
               email: data.email,
               password : data.password,
               name : data.name
           });
           await user.save();
           return true;
        }
    } catch(err) {console.log(err); return 'error';}
}
async function remove(id) {
    try {
        let user = await UserModel.findByIdAndRemove(id);
        if(user) return true;
        else return false;
    } catch(err) {console.log(err); return 'error';}
}
async function updateName(id, name) {
    try {
        let user = await UserModel.findById(id, ['name']);
        if(!user) return null;
        else {
            user.name = name;
            await user.save();
            return true;
        }
    } catch(err) {console.log(err); return 'error';}
}
async function updatePassword(id, password) {
    try {
        let user = await UserModel.findById(id, ['password']);
        if(!user) return null;
        else {
            user.password = password;
            await user.save();
            return true;
        }
    } catch(err) {console.log(err); return 'error';}
}
async function update(id, name, password) {
    try {
        let user = await UserModel.findById(id, ['name', 'password']);
        if(!user) return null;
        else {
            user.password = password;
            user.name = name;
            await user.save();
            return true;
        }
    } catch(err) {console.log(err); return 'error';}
}
module.exports = {login, get, set, remove, update, updateName, updatePassword};