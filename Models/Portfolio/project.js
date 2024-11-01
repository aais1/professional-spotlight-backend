import { model,Schema } from "mongoose";
import Portfolio from "./portfolio.js";

const projectSchema = new Schema({
     title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
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