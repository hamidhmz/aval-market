// config lets you define a set of default parameters, and extend them for different deployment environments(development, qa, staging, production, etc.)   https://www.npmjs.com/package/config
// in this app is set in docker config it is mean that config module use config/docker.json file if you wanna change that go to docker-compose.yml and set NODE_ENV to anything you want (e.g : export NODE_ENV=production) and  create JSON file in the config and customize it
import config from "config";
export default function(mongoose){
    const db = config.get("db");// need set this in docker.json
    mongoose.connect(db).then(()=>console.log(`connected to ${db}...`));
}
