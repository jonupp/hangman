import {playerStore} from "../services/playerStore.js";
import {Player} from "../services/player.js";

function handleGetLogin(req,res){
    res.render('login', {title:'hangman', layout:false});
}

async function handlePostRegister(req, res){
    let username : string = req.body.username;
    let password : string = req.body.password;

    if((await playerStore.get({username: username},{},1))[0]){ //Player does already exist
    }else{  //Player does not exist
        await playerStore.add(new Player(username, 0, "passwordHash"));
    }

    res.redirect("/login"); //get /login
}

async function handlePostLogin(req, res){
    let username : string = req.body.username;
    let password : string = req.body.password;

    //TODO: Authentication Logic
    //1. Look in DB if existing passwordhash corresponds to send password(hash)

    //2. If so, send JWT with player._id in payload

    res.redirect('/');
}

export {handleGetLogin, handlePostRegister, handlePostLogin};