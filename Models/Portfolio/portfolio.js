import { Schema, model } from "mongoose";
import slugify from "slugify";

const portfolioSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    portfoliooftheweek: {
        type: Boolean,
        default: false,
    },
    Project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
    Keyaspect: {
        type: Schema.Types.ObjectId,
        ref: "Keyaspect",
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    listed: {
        type: Boolean,
        default: false,
    },
    banner: {
        type: String,
        required: true,
    },
});
// Pre-save middleware to generate slug from title
portfolioSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});
const Portfolio = model("Portfolio", portfolioSchema);
export default Portfolio;