import { model,Schema } from "mongoose";
import Portfolio from "./portfolio.js";

const projectSchema = new Schema({
     title: {
        type: String,
        
    },
    link: {
        type: String,
        
    },
    description: {
        type: String,
        required: true,
    },
    PortfolioId: {
        type: Schema.Types.ObjectId,
        ref: "Portfolio"
    },
});
const Project = model("Project", projectSchema);
 export default Project;