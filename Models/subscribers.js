import { Schema,model } from "mongoose";

const subscriberSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});
const Subscriber = model("Subscriber", subscriberSchema);
export default Subscriber;