import connection from "../dbStrategy/database.js"

export async function insertHashtags(item){
    const {rows:insertedHashtag} = await connection.query(`
    INSERT INTO hashtags (text) 
    VALUES($1)
    RETURNING id`, [item])
    return insertedHashtag[0].id;
}

export async function selectHashtags(item){
    const {rows:existingHashtag} = await connection.query(`
    SELECT id 
    FROM hashtags
    WHERE text = $1`,
    [item] );
    return existingHashtag;
}

export async function selectAllHashtags(){
    const {rows : hashtags} = await connection.query(`
    SELECT text 
    FROM hashtags`);
    return hashtags;
}

export async function insertHashtagsPosts(postId, hashtagId){
    const {rowCount} = await connection.query(`
        INSERT INTO "hashtagPosts"
        ("postId", "hashtagId")
        VALUES
        ($1,$2)`
        ,[postId, hashtagId]
    );
    return rowCount;
}

export const hashtagsRepository = { 
    insertHashtags,
    selectHashtags,
    insertHashtagsPosts,
    selectAllHashtags,
}