const UserModel = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
/*
    로그인
    @param email    :String
    @param password :String

    @return _id     :String     로그인 성공
    @return null    :NULL       로그인 실패
*/
async function login(email, password) {
    
    try {
        const user = await UserModel.findOne({email: email}, ['password', 'name']);
        if(!user) {return null} // 등록된 회원 없음
        else {
            return await bcrypt.compare(password, user.password) ? {_id : user._id, name : user.name} : null;
        }
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

/*
    회원가입
    @param email :String
    @param password :String
    @param name :String

    @return 1   성공
    @return 0   중복
    @return -1  에러
*/
async function set(email, password, name) {
    try {
        let user = await UserModel.findOne({email: email});
        if(user?._id) return 0; // 이미 존재하는 아이디
        else {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            user = new UserModel({
                email: email,
                password : hash,
                name : name
            });
            await user.save();
            return 1;
        }
    } catch(err) {console.log(err); return -1;}
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