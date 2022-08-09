import { searchUserByName } from "../repositories/usersRepository.js";


export async function userByName(req, res){
    
    const {name} = req.params

    try{
        const {rows:users} = await searchUserByName(name)
        res.status(200).send(users)
    }
    catch(error){
        console.log(error)
    }

    
}