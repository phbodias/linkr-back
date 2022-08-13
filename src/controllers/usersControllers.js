import { searchUserByName , searchUserById} from "../repositories/usersRepository.js";
import {getPostsByUserId} from "../repositories/usersRepository.js"

export async function userByName(req, res){
    
    const {name} = req.params

    console.log(name)
    try{
       
        const {rows:users} = await searchUserByName(name)
        res.status(200).send(users)
    }
    catch(error){
        console.log(error)
        res.status(500).send("catch error")
    }

    
}

export async function userById(req, res){
    const {id} = req.params;

    try{
        const {rows:user} = await searchUserById(id)
        res.status(200).send(user)
    }
    catch(error){
        console.log(error)
        res.status(500).send('catch error')
    }

}

export async function getPostsUser(req, res){
    const {id}=req.params

    try{
        
        const {rows:user} = await searchUserById(id)
        console.log(user)

        if(user.length===0){
            res.status(404).send('NOT HAVE A USER WITH THIS ID')
        }

        const posts = await getPostsByUserId(id)
        res.status(200).send(posts)
    }
    catch(error){
        console.log(error)
        res.status(500).send('servidor crashou')
    }
}

export async function userLogged(req, res){
    const userId = res.locals.userId;

    try{
        const {rows:user} = await searchUserById(id)
        res.status(200).send(user)
    }
    catch(error){
        console.log(error)
        res.status(500).send('catch error')
    }
}
