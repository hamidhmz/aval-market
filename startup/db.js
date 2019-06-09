import config from "config";
export default function(mongoose){
    const db = config.get("db");
    mongoose.connect(db).then(()=>console.log(`connected to ${db}...`));
}
