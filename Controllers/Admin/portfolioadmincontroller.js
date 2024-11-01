import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import express from "express";
import Portfolio from "../../Models/Portfolio/portfolio.js";
import Project from "../../Models/Portfolio/project.js";
import Keyaspects from "../../Models/Portfolio/keyaspect.js";
import slugify from "slugify";
import e from "express";

const router = express.Router();
router.use(cookieParser());

const createPortfolio = async (req, res) => {
    try {
        const { title, category, about, banner } = req.body;
        // Generate slug from title
        const slug = slugify(title, { lower: true, strict: true });

        const portfolio = new Portfolio({
            title,
            category,
            about,
            banner,
            slug // Add slug to the portfolio
        });

        await portfolio.save();
        res.status(201).json({ portfolio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addproject = async (req, res) => {
    try {
        const { title, description, link, PortfolioId } = req.body;
        console.log(req.body);
        const project = new Project({
            title,
            description,
            link,
            PortfolioId: PortfolioId
        });
        await project.save();
        res.status(201).json({ project });
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ error: err.message });
    }
};
const addkeyaspect = async (req, res) => {
    try {
        const { keyaspects, PortfolioId } = req.body;

        const keyaspect = new Keyaspects({
            keyaspect: keyaspects,
            PortfolioId: PortfolioId
        });

        await keyaspect.save();
        res.status(201).json({ keyaspect });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const getallportfolio = async (req, res) => {
    const { page = 1, limit = 6 } = req.query; // Default to page 1 and limit 6 if not provided

    try {
        const portfolio = await Portfolio.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const totalItems = await Portfolio.countDocuments();

        res.status(200).json({
            portfolio,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getprojectsandkeyaspectsbyportfolioid = async (req, res) => {
    try {
        const { portfolioId } = req.params;

        const project = await Project.find({ PortfolioId: portfolioId });
        const keyaspect = await Keyaspects.find({ PortfolioId: portfolioId });


        res.status(200).json({ project, keyaspect });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// edit portfolio also modify the slug
const editportfolio = async (req, res) => {
    try {
        const { portfolioId } = req.params;
        const { title, category, about, banner } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const portfolio = await Portfolio.findByIdAndUpdate(portfolioId, { title, category, about, banner, slug }, { new: true });
        res.status(200).json({ portfolio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// edit project 
const editproject = async (req, res) => {
    try {
        console.log(req.body);
        const { title, description, id, link } = req.body;

        // Validate the required fields
        if (!title || !description || !link) {
            return res.status(400).json({ message: "Title, description, and link are required" });
        }

        console.log("id", id);
        // Find and update the project
        const project = await Project.findByIdAndUpdate(
            id,
            { title, description, link },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        // Check if the update was successful
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ error: err.message });
    }
};

const editkeyaspect = async (req, res) => {
    try {
        console.log(req.body);
        const { keyaspectId, keyaspects, PortfolioId } = req.body;

        // Update the Keyaspect document
        const updatedKeyaspect = await Keyaspects.findByIdAndUpdate(
            keyaspectId,
            { keyaspect: keyaspects, PortfolioId },
            { new: true }
        );

        if (!updatedKeyaspect) {
            return res.status(404).json({ error: 'Keyaspect not found' });
        }

        res.status(200).json({ keyaspect: updatedKeyaspect });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const updatelisted = async (req, res) => {
    try {
        console.log(req.body);
        const { title } = req.body;

        // Find the portfolio by title
        const portfolio = await Portfolio.findOne({ title });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        // Toggle the listed status
        const newListedStatus = !portfolio.listed;

        // Update the portfolio with the new listed status
        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { title },
            { listed: newListedStatus },
            { new: true }
        );

        res.status(200).json({ portfolio: updatedPortfolio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// delete keyaspect
const deletekeyaspect = async (req, res) => {
    try {
        const { keyaspectId } = req.params;
        const keyaspect = await Keyaspects.findByIdAndDelete(keyaspectId);
        res.status(200).json({ keyaspect });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// there can be only one portfolio of the week at a time when a new portfolio is set as portfolio of the week the previous portfolio of the week is set to false 
const portfoliooftheweek = async (req, res) => {
    try {
        const { portfolioId } = req.params;

        // Set the new portfolio of the week
        const portfolio = await Portfolio.findByIdAndUpdate(portfolioId, { portfoliooftheweek: true }, { new: true });
        console.log('Updated Portfolio of the Week:', portfolio);

        // Find and update the previous portfolio of the week
        const previousportfolio = await Portfolio.findOne({ portfoliooftheweek: true, _id: { $ne: portfolioId } });
        if (previousportfolio) {
            previousportfolio.portfoliooftheweek = false;
            await previousportfolio.save();
            console.log('Previous Portfolio of the Week:', previousportfolio);
        }
        res.status(200).json({ portfolio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// delete portfolio with its related projects and keyaspects

const deleteportfolio = async (req, res) => {
    try {
        const { portfolioId } = req.params;
        // Delete the portfolio
        const portfolio = await Portfolio.findByIdAndDelete(portfolioId);
        
        // Check if the portfolio was found and deleted
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        
        // Delete all projects associated with the portfolio
        const projects = await Project.deleteMany({ PortfolioId: portfolioId });
        
        // Delete all key aspects associated with the portfolio
        // Fixed: Changed keyaspects to Keyaspects (the model name)
        const keyaspects = await Keyaspects.deleteMany({ PortfolioId: portfolioId }); // Also fixed PostfolioId to PortfolioId

        res.status(200).json({ 
            message: "Portfolio and associated projects and key aspects deleted successfully", 
            portfolio, 
            projects, 
            keyaspects 
        });
    } catch (err) {
        console.log("error", err.message);
        res.status(500).json({ error: err.message });
    }
};

export default { createPortfolio, addproject, addkeyaspect, getallportfolio, getprojectsandkeyaspectsbyportfolioid, editportfolio, editproject, editkeyaspect, updatelisted, deletekeyaspect, portfoliooftheweek, deleteportfolio };