import { Schema, model } from "mongoose";
import slugify from "slugify";

const biographySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
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
    description: {
        type: String,
        default: "No description provided",
    },
    banner: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
        }
    ],
    listed: {
        type: Boolean,
        default: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    biographyoftheday: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    heart: {  // New field for tracking heart status
        type: Boolean,
        default: false,  // Default to false
    },
});

// Pre-save middleware to generate slug from title
biographySchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Biography = model("Biography", biographySchema);
export default Biography;
