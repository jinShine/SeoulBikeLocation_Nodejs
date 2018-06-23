const express = require('express');
const router = express.Router();
const seoulbikeInfo = require('../model/seoulbike_infomation');
const sendEmail = require('../email');
const validator = require("email-validator");

//GET
router.get('/rentalShopInfo', showRentalShopList); // 전체 위치 보기
router.get('/rentalShopInfo/:district', showDistrict); // 특정 정보 입력

//POST
router.post('/login', loginCheck); // 로그인 체크
router.post('/signup', signUp); // 회원가입
router.post('/findpassword', findPasswordAndSend); // 비밀번호 찾기 (메일로 전송)


module.exports = router;


//전체 위치 출력
function showRentalShopList(req, res) {

    const seoulbikeLocation = seoulbikeInfo.getRentalShopList();

    seoulbikeLocation.then(function(data){
        res.send({msg:'success', totalCount:data.length, seoulbikeItems:data});
    }).catch(function(err){
        res.send({msg:'fail', totalCount:0});
    });
    
}

//검색 리스트 출력
function showDistrict(req, res) {
    
    const districtName = req.params.district;
    const seoulbikeLocation = seoulbikeInfo.getDistrictList(districtName);
    
    seoulbikeLocation.then(function(data){
        res.send({msg:'success', totalCount:data.length, seoulbikeItems:data});
    }).catch(function(err){
        res.send({msg:'fail', totalCount:0});
    });
}

//회원인지 체크
function loginCheck(req, res) {
    
    const email = req.body.email;
    const password = req.body.password;

    console.log("email: ", email);
    console.log("password : ", password);

    if (!email || !password) {
        res.send({stateMsg:'FAIL', msg:'아이디나 비밀번호를 정확히 입력 해주세요.'});
        return;
    }

    const userData = seoulbikeInfo.checkLoginInfo(email, password);

    userData.then(function(result){
        res.send({stateMsg:'SUCCESS', loginData:result});
    }).catch(function(err){
        res.send({stateMsg:'FAIL', error:err});
    });
}

//회원가입
function signUp(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    console.log("email : ", email);
    console.log("password : ", password);

    if (email) {
        //이메일 형식 체크
        if ( validator.validate(email) == false ) {
            res.send({stateMsg:'FAIL', error: {code:4002, msg:'이메일형식이 아닙니다. \n 이메일 형식으로 입력해주세요.'}});
            return;
        }
    }

    if (password) {
        //비밀번호 6자리 이상 체크 
        if ( password.length < 6)  {
            res.send({stateMsg:'FAIL', error: {code:4004, msg:'비밀번호 6자리 이상 입력해주세요! \n 이메일 형식으로 입력해주세요.'}});
            return;
        }
    }

    if (!email || !password) {
        res.send({stateMsg:'FAIL', error: {code:4003, msg:'아이디나 비밀번호를 정확히 입력 해주세요.'}});
        return;
    }

    const usrData = seoulbikeInfo.userSignUp(email, password);
    
    usrData.then(function(result){
        res.send({stateMsg:'SUCCESS', loginData:result});

    }).catch(function(err){
        res.send({stateMsg:'FAIL', error:err});
    });
}

//회원가입
function findPasswordAndSend(req, res) {

    const email = req.body.email;

    console.log("email : ", email);

    if (email) {
        //이메일 형식 체크
        if ( validator.validate(email) == false ) {
            res.send({stateMsg:'FAIL', error: {code:4002, msg:'이메일형식이 아닙니다. \n 이메일 형식으로 입력해주세요.'}});
            return;
        }
    }

    const usrData = seoulbikeInfo.findPassword(email);
    
    usrData.then(function(result){

        sendEmail.findFromMail(result);

        res.send({stateMsg:'SUCCESS', loginData:result});

    }).catch(function(err){
        res.send({stateMsg:'FAIL', error:err});
    });
}