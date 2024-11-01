import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import express from "express";
import Biography from "../../Models/Biogrphies/biography.js";
import Portfolio from "../../Models/Portfolio/portfolio.js";
import Project from "../../Models/Portfolio/project.js";
import review from "../../Models/Biogrphies/review.js";
import  Keyaspects from "../../Models/Portfolio/keyaspect.js";

import slugify from "slugify";

const router = express.Router();
router.use(cookieParser());

const createBiography = async (req, res) => {
    try {
        const { title, category, banner, description, images } = req.body;

        // Check if the title is provided
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Generate slug from title
        const slug = slugify(title, { lower: true, strict: true });

        // Find existing biography by title
        let biography = await Biography.findOne({ title });

        if (biography) {
            // Update the existing biography
            biography.category = category || biography.category;
            biography.banner = banner || biography.banner;
            biography.description = description || biography.description;
            biography.images = images || biography.images;
            biography.slug = slug;  
         

            await biography.save();
            

           
            return res.status(200).json({ message: "Biography updated successfully", biography });
        } else {
            // Create a new biography
            const newBiography = new Biography({
                title,
                category,
                banner,
                description,
                images,
                slug,
            });
            biography = await newBiography.save();

            return res.status(201).json({ message: "Biography created successfully", biography });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const BiographyDescription = async (req, res) =>{
    try {
        const { title, description } = req.body;
        const existingBiography = await Biography.findOne({ title });
        if (existingBiography) {
            const updatedBiography = await Biography.findOneAndUpdate(
                { title },
                {
                    $set: {
                        ...(description && { description }),
                    }
                },
                { new: true }
            );
            return res.status(200).json({ message: "Biography updated successfully", biography: updatedBiography });
        } else {
            return res.status(404).json({ message: "Biography not found" });
        }
}
catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const BiographyImages = async (req, res) =>{
    try {
        const { title, images } = req.body;
        const existingBiography = await Biography.findOne({ title });
        if (existingBiography) {
            const updatedBiography = await Biography.findOneAndUpdate(
                { title },
                {
                    $set: {
                        ...(images && { images }),
                    }
                },
                { new: true }
            );
            return res.status(200).json({ message: "Biography updated successfully", biography: updatedBiography });
        } else {
            return res.status(404).json({ message: "Biography not found" });
        }
}
  catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// A function that lists biography (change status true or false)
import nodemailer from 'nodemailer';
import Subscribers from '../../Models/subscribers.js'; // Make sure to import your Subscribers model

// Create a transporter using Gmail (place this outside the function, perhaps at the top of your file)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'professionalsspotlight@gmail.com',
    pass: 'boyw bfki covl ithn' 
  }
});
// a biography to return  the biography from slug 
const TestingBiography = async (req, res) => {
    try {
        // Ensure slug is declared and initialized before use
        const slug = req.params.slug; // or however you are getting the slug
    
        const biography = await Biography.findOne({ slug: slug });
    
        if (biography) {
            
            return res.status(200).json({ biography });
            
        } else {
            return res.status(404).json({ message: "Biography not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Updated ListBiography function
const ListBiography = async (req, res) => {
    try {
        const { title } = req.body;


        // Check if the biography with the given title exists
        const existingBiography = await Biography.findOne({ title });
   

        if (existingBiography) {
            // Toggle the listed status
            const newListedStatus = !existingBiography.listed;

            // Update the listed status
            const updatedBiography = await Biography.findOneAndUpdate(
                { title },
                {
                    $set: {
                        listed: newListedStatus // Toggle the listed field
                    }
                },
                { new: true } // Return the updated document
            );
           
            // If the biography is now listed (true), send an email
            if (newListedStatus) {
                try {
                    // Fetch all subscribers
                    const subscribers = await Subscribers.find();
                    const emails = subscribers.map(subscriber => subscriber.email);

                    // Email content
                    const mailOptions = (email) => ({
                        from: 'professionalsspotlight@gmail.com',
                        to: email,
                        subject: 'New Biography Available!',
                        text: `A new biography "${title}" has been listed. Check it out on our website!`,
                        html: `<h1>New Biography Alert!</h1><p>A new biography "${title}" has been listed. <a href="your-website-url/biography/${updatedBiography.slug}">Click here</a> to check it out on our website!</p>`
                    });

                    // Send emails individually
                    for (const email of emails) {
                        try {
                            const info = await transporter.sendMail(mailOptions(email));
                     
                        } catch (emailError) {
                            console.error('Error sending email to:', email, emailError);
                        }
                    }
                } catch (emailError) {
                    console.error('Error fetching subscribers or sending emails:', emailError);
                }
            }

            return res.status(200).json({ message: "Biography updated successfully", biography: updatedBiography });
        } else {
            return res.status(404).json({ message: "Biography not found" });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: error.message });
    }
};



// change status of biography of the day
const BiographyOfTheDay = async (req, res) => {
    try {
        const { title } = req.body;
        // Find the biography by title and set its biographyoftheday status to true
        const updatedBiography = await Biography.findOneAndUpdate(
            { title },
            { $set: { biographyoftheday: true } },
            { new: true }
        );

        if (!updatedBiography) {
             
            return res.status(404).json({ message: "Biography not found" });
        }

        // Set biographyoftheday status to false for all other biographies
        await Biography.updateMany(
            { title: { $ne: title } },
            { $set: { biographyoftheday: false } }
        );

        return res.status(200).json({ message: "Biography updated successfully", biography: updatedBiography });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// get all biographies
const GetBiographies = async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query; // Extract page and limit from query, with default values

        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        // Fetch the paginated results
        const biographies = await Biography.find()
            .skip(skip)
            .limit(parseInt(limit));

        // Get the total number of documents
        const total = await Biography.countDocuments();
        // Return the paginated results along with metadata
        return res.status(200).json({
            biographies,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// get description and images of biography by title 
 const getimagesanddescription = async (req, res) => {
    try {
        const { title } = req.params;
        const biography = await Biography.findOne({ title });
        if (biography) {
            return res.status(200).json({ description: biography.description, images: biography.images });
        } else {
            return res.status(404).json({ message: "Biography not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// get all biographies titles
const GetBiographiesTitles = async (req, res) => {
    try {
        const biographies = await Biography.find({}, { title: 1 });
        return res.status(200).json({ biographies });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

import mongoose from "mongoose";
// delete biography
const deletebiography = async (req, res) => {   
    try {
        const { id } = req.params;

        // Validate the id parameter
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid biography ID" });
        }

        const biography = await Biography.findByIdAndDelete(id);
        if (biography) {
            return res.status(200).json({ message: "Biography deleted successfully" });
        } else {
            return res.status(404).json({ message: "Biography not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// delete image from biography
const deleteImage = async (req, res) => {
   
    try {
        const { id, image } = req.body;

        // Check if title and image are provided
        if (!id || !image) {
            return res.status(400).json({ message: "Title and image URL are required" });
        }

        // Find the biography by title
        const existingBiography = await Biography.findOne({ _id: id });
        if (!existingBiography) {
            return res.status(404).json({ message: "Biography not found" });
        }

     
        // Filter out the image to be deleted
        const updatedImages = existingBiography.images.filter(
            (img) => img !== image
        );

        // Log the updated images
    
        // Update the biography with the new images array
        const updatedBiography = await Biography.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    images: updatedImages,
                }
            },
            { new: true }
        );

        // Check if the update was successful
        if (!updatedBiography) {
            return res.status(500).json({ message: "Failed to update biography" });
        }

        return res.status(200).json({ message: "Biography updated successfully", biography: updatedBiography });
    } catch (error) {
        console.error("Error deleting image from biography:", error);
        return res.status(500).json({ message: error.message });
    }
};

const GetHeartedBiographies = async (req, res) => {
    try {
        console.log('Fetching hearted biographies...'); // For debugging
        const biographies = await Biography.find({ heart: true });
        return res.status(200).json({ message: "Biographies fetched successfully", biographies });
    } catch (error) {
        console.error("Error fetching biographies:", error); // Log error for debugging
        return res.status(500).json({ message: "An error occurred", error });
    }
};


const AddToHeart = async (req, res) => {
    try {
        const { title } = req.body;

        // Check if the biography exists
        const existingBiography = await Biography.findOne({ title });
        if (!existingBiography) {
            return res.status(404).json({ message: "Biography not found" });
        }

        // Count how many biographies currently have the heart
        const heartedCount = await Biography.countDocuments({ heart: true });

        // Allow adding a heart if the count is less than 4
        if (heartedCount >= 4 && !existingBiography.heart) {
            return res.status(400).json({ error: "Cannot add heart. Maximum limit reached." });
        }

        // Update the biography
        const updatedBiography = await Biography.findOneAndUpdate(
            { title },
            {
                $set: {
                    heart: true,
                }
            },
            { new: true }
        );

        return res.status(200).json({ message: "Biography updated successfully", biography: updatedBiography });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
};

const UnlikeBiography = async (req, res) => {
    try {
        const { title } = req.body;

        // Check if the biography exists
        const existingBiography = await Biography.findOne({ title });
        if (!existingBiography) {
            return res.status(404).json({ message: "Biography not found" });
        }

        // Only proceed if the biography has a heart
        if (!existingBiography.heart) {
            return res.status(400).json({ message: "Biography is not currently liked." });
        }

        // Update the biography to remove the heart
        existingBiography.heart = false; // Directly modify the heart property
        await existingBiography.save(); // Save the updated biography

        return res.status(200).json({ message: "Biography unliked successfully", biography: existingBiography });
    } catch (error) {
        console.error("Error unliking biography:", error); // Log the error for debugging
        return res.status(500).json({ message: "An error occurred", error });
    }
};






export default {AddToHeart,UnlikeBiography,createBiography,GetHeartedBiographies,TestingBiography, BiographyDescription,BiographyImages,ListBiography,BiographyOfTheDay,GetBiographies,getimagesanddescription ,GetBiographiesTitles,deletebiography ,deleteImage };