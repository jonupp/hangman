import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

import {playerStore} from "../services/playerStore.js";
import {Player} from "../services/player.js";

function handleGetLogin(req,res){
    res.render('login', {title: 'hangman', layout: false});
}

function handleGetLogout(req, res) {
    res.clearCookie("jwt_token");
    res.clearCookie("game_id");
    res.redirect("/login");
}

async function handlePostRegister(req, res){
    let username : string = req.body.username;
    let password : string = req.body.password;

    if (!username || !password) {
        res.status(400).json({hint: {Text: "Username or password is missing."}});
        return;
    }

    if (username.length < 3){
        res.status(400).json({hint: {Text: "The username has to contain at least three characters."}});
        return;
    }

    if (password.length < 6){
        res.status(400).json({hint: {Text: "The password has to contain at least six characters."}});
        return;
    }

    if(await playerStore.getPlayerByUsername(username)){ //Player does already exist
        res.render("login", {hint:{Text:"The username is already taken."}, layout: false});
        return;
    }else{ //Player does not already exist
        await playerStore.add(new Player(username, 0, CryptoJS.SHA512(process.env.NONCE + password).toString(CryptoJS.enc.Hex)));
        res.render("login", {hint: {Text:"Successfully registered."}, layout: false});
    }
}

async function handlePostLogin(req, res){
    let username : string = req.body.username;
    let password : string = req.body.password;

    let player = await playerStore.getPlayerByUsername(username);
    if(player){
        if(CryptoJS.SHA512(process.env.NONCE + password).toString(CryptoJS.enc.Hex)===player.passwordHash){
            let token = jwt.sign({player_id: player._id}, process.env.SECRET, {expiresIn: 60*60*24});
            res.cookie("jwt_token", token, {httpOnly: true});
            res.redirect("/");
        }else{
            res.render("login", {hint: {Text: "Wrong password."}, layout: false});
        }
    }else{ //No player with this username exists
        res.render("login", {hint: {Text: "No account with this username exists."}, layout: false});
    }
}


export {handleGetLogin, handlePostRegister, handlePostLogin, handleGetLogout};
