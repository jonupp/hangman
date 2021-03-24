import {playerStore} from "../services/playerStore.js";
import {Player} from "../services/player.js";
import CryptoJS from 'crypto-js';
import jwt from "jsonwebtoken";

function handleGetLogin(req,res){
    res.render('login', {title:'hangman', layout:false});
}

async function handlePostRegister(req, res){
    let username : string = req.body.username;
    let password : string = req.body.password;

    if((await playerStore.get({username: username},{},1))[0]){ //Player does already exist
        res.render("login", {hint:{Text:"The username is already taken."}, layout:false} );
        return;
    }else{  //Player does not exist
        await playerStore.add(new Player(username, 0, CryptoJS.SHA512(process.env.NONCE + password).toString(CryptoJS.enc.Hex)));
        res.render("login", {hint:{Text:"Successfully registered."}, layout:false});
    }
}

async function handlePostLogin(req, res){
    let username : string = req.body.username;
    let password : string = req.body.password;

    let player = (await playerStore.get({"username":username}, {},1))[0];
    if(player){
        if(CryptoJS.SHA512(process.env.NONCE + password).toString(CryptoJS.enc.Hex)===player.passwordHash){
            let token = jwt.sign({player_id:player._id}, process.env.SECRET);
            res.cookie('jwt_token', token, {httpOnly:true});
            res.redirect("/");
        }else{
            res.render("login", {hint:{Text:"Wrong password."}, layout:false});
        }
    }else{ //No player with this username exists
        res.render("login", {hint:{Text:"No account with this username exists."}, layout:false});
    }
}

export {handleGetLogin, handlePostRegister, handlePostLogin};