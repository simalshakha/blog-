const mongoose=require('mongoose')
const connectdb=async()=>{
    try{
        mongoose.set('strictQuery',false);
        const conn =await mongoose.connect(process.env.mongodb_url);
        console.log(`database connected:${conn.connection.host}`)

    }catch(error){
        console.log(error);

    }
    
}
module.exports=connectdb;