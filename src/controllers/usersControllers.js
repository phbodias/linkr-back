import { searchUserByName , searchUserById} from "../repositories/usersRepository.js";


export async function userByName(req, res){
    
    const {name} = req.params

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
    const {id} = req.params

    try{
        const {rows:user} = await searchUserById(id)
        res.status(200).send(user)
    }
    catch(error){
        console.log(error)
        res.status(500).send('catch error')
    }

}