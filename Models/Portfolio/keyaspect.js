import { Schema,model } from "mongoose";


const keyaspectSchema = new Schema({
     PortfolioId: {
        type: Schema.Types.ObjectId,
        ref: "Portfolio"
    },
    keyaspect:[
        {
            id:{
                type:String,
                required:true
            },
            type:String,
            required:true
        }
    ]
});
const Keyaspect = model("Keyaspect", keyaspectSchema);
export default Keyaspect;
