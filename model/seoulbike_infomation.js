const MongoClient = require('mongodb').MongoClient;

// var url = 'mongodb://localhost:27017/seoulBikeLocationDB';
var url = 'mongodb+srv://seungjin:whis!346@cluster-11ty7.mongodb.net/test?retryWrites=true' // AWS
const dbName = 'seoulBikeLocationDB';
var db;

class SeoulBikeInfo {

    constructor () {

        //MongoDB 연결
        MongoClient.connect(url, function(err, database) {
            if(err){
                console.log('MongoDB 연결 실패', err);
                return;
            }

            console.log("MongoDB 연결 성공");
            db = database.db(dbName);

        });
        
    }

    getRentalShopList() {
        return new Promise((resolve, reject) => {
            var currentLocation = db.collection('location');

            currentLocation.find().toArray(function (err, docs) {
                if(err){
                    console.error('전체 대여소 출력 에러 : ', err);
                    return;
                }
                console.log('-----------[전체 대여소 출력]-----------');
                console.log(docs);

                resolve(docs);
            });

        });
    }

    getDistrictList(district) {
        return new Promise((resolve, reject) => {
            var currentLocation = db.collection('location');
            
            currentLocation.find({
                $or: [
                    {'addr_gu':{'$regex':district}}, {'new_addr':{'$regex':district}}, {'content_id':{'$regex':district}}, {'content_nm':{'$regex':district}}
                ]
            }).toArray(function (err, docs) {
                if(err){
                    console.error('지역 대여소 출력 에러 : ', err);
                    return;
                }
                console.log('-----------[지역 대여소 검색 출력]-----------');
                console.log(docs);

                resolve(docs);
            });

        });
    }

    checkLoginInfo(email, password) {
        return new Promise((resolve, reject) => {

            var loginData = db.collection('userLoginData');

            const userEmail = email;
            const userPassword = password;

            loginData.find({
                $and: [
                    {'email' : userEmail, 'password' : userPassword}
                ]
            }).toArray(function (err, docs) {
                if(err){
                    console.error('checkLoginInfo: ', err);
                    return;
                }
                
                console.log("checkLoginInfo Docs : ", docs);
                if(docs == '') {
                    console.log('아이디나 패스워드가 일치하지 않습니다.');
                    reject({msg:"아이디나 패스워드가 일치하지 않습니다.", code:4000}); // 아이디 패스워드 불 일치
                } else {
                    console.log('-----------[아이디 패스워드 일치]-----------');
                    console.log(docs[0].id);

                    resolve(docs);
                }
            });
        });
    }

    userSignUp(email, password) {
        return new Promise((resolve, reject) => {

            var loginData = db.collection('userLoginData');
            
            const userEmail = email;
            const userPassword = password;

            var userCount = 0;

            //User 수
            loginData.find().count((err, count)=>{
                console.log("count : ", count); 
                userCount = count;
            });

            loginData.find({email:userEmail}).toArray(function(err, docs) {
                if(err){
                    console.error('checkLoginInfo: ', err);
                    return;
                }

                console.log("SignUp Docs : ", docs);

                
                if(userCount == 0 || docs == '') {
                    
                    console.log('-----------[회원 가입 성공]-----------');
                    console.log(docs);

                    var userInfo = { userNumber: userCount + 1, email: userEmail, password: userPassword };

                    loginData.insertOne(userInfo, function (err, docs){
                        if(err) {
                            console.error('회원 가입 에러 : ', err);
                            return;
                        }

                        if(docs == '') {
                            console.error('회원 가입 에러 :');
                            
                        } else {
                            console.log('-----------[회원 가입 성공]-----------');
                            console.log(docs);
                            
                            resolve(docs);
                        }

                    });
                } else {
                    console.log('이미 가입된 아이디가 있습니다.');
                    reject({msg: "이미 가입된 아이디가 있습니다.", code:4001}); // 4000 ID 중복
                }
            });
        });
    }

    findPassword(email) {
        return new Promise((resolve, reject) => {

            var loginData = db.collection('userLoginData');

            const userEmail = email;

            loginData.find({
                $and: [
                    {'email' : userEmail}
                ]
            }).toArray(function (err, docs) {
                if(err){
                    console.error('checkLoginInfo: ', err);
                    return;
                }
                
                console.log("findPassword Docs : ", docs);
                if(docs == '') {
                    console.log('가입하셨던 이메일이 아닙니다.');
                    reject({msg:"가입하셨던 이메일이 아닙니다.", code:4005}); // 아이디 패스워드 불 일치
                } else {
                    console.log('-----------[이메일 찾음]-----------');

                    resolve(docs);
                }
            });
        });
    }
}

module.exports = new SeoulBikeInfo();
