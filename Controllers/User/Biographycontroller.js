import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import express from "express";
import Biography from "../../Models/Biogrphies/biography.js";
import Portfolio from "../../Models/Portfolio/portfolio.js";
import Project from "../../Models/Portfolio/project.js";
import review from "../../Models/Biogrphies/review.js";
import Keyaspects from "../../Models/Portfolio/keyaspect.js";
import Subscribers from "../../Models/subscribers.js";

const router = express.Router();
router.use(cookieParser());


const GetAllBiographies = async (req, res) => {
    console.log('Request received');
    try {
      // Extract query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = 6;  // Define a fixed number of biographies per page
      const startIndex = (page - 1) * limit;
  
      // Extract category filter from the query
      const { category } = req.query;
  
      console.log(`Page: ${page}, Limit: ${limit}, Start Index: ${startIndex}`);
      console.log(`Category Filter: ${category}`);
  
      // Construct the filter object based on query params
      const filter = { listed: true };
      if (category && category !== 'all') {
        filter.category = category;  // Match the selected category
      }
  
      console.log('Filter:', filter);
  
      // Get the filtered biographies, paginated by `skip`
      const biographies = await Biography.find(filter)
        .sort({ createdAt: -1 })  // Sort by most recent first
        .skip(startIndex)         // Skip previous pages' results
        .limit(limit);            // Limit to the number of biographies per page (6)
  
      console.log('Fetched Biographies:', biographies.length);
  
      // Get the total number of biographies in the selected category (without limit)
      const total = await Biography.countDocuments(filter);
      console.log('Total Count:', total);
  
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      console.log('Total Pages:', totalPages);
  
      // Send the response with the current page's biographies and pagination info
      return res.status(200).json({ biographies, total, totalPages });
    } catch (error) {
      console.error('Error fetching biographies:', error.message);
      return res.status(500).json({ message: error.message });
    }
  };
  


const ShowHeart=async(req,res)=>{
 
        try {
            console.log('Fetching hearted biographies...'); // For debugging
            const biographies = await Biography.find({ heart: true });
            return res.status(200).json({ message: "Biographies fetched successfully", biographies });
        } catch (error) {
            console.error("Error fetching biographies:", error); // Log error for debugging
            return res.status(500).json({ message: "An error occurred", error });
        }

}

// get 5 biographies and 5 portfolios which are latest
const GetBiographiesandPortfoliosforhome = async (req, res) => {
    try {
        const biographies = await Biography.find({ listed: true }).sort({ createdAt: -1 }).limit(5);
        const portfolios = await Portfolio.find({ listed: true }).sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({ biographies, portfolios });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// get biography having biographyoftheday true and portfolio having portfoliooftheweek true
const GetBiographyandPortfoliooftheday = async (req, res) => {
    try {
        const biography = await Biography.findOne({ biographyoftheday: true });
        const portfolio = await Portfolio.findOne({ portfoliooftheweek: true });
        return res.status(200).json({ biography, portfolio });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// get poppur biographies randomly 7 biographies
const GetPopularBiographies = async (req, res) => {
    try {
        const biographies = await Biography.aggregate([{ $sample: { size: 7 } }]);
        return res.status(200).json({ biographies });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


  
// get all portfolios while supporting pagination 6 portfolios per page
const GetAllPortfolios = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const portfolios = await Portfolio.find().sort({ createdAt: -1 }).limit(limit).skip(startIndex);
        const total = await Portfolio.countDocuments();
        return res.status(200).json({ portfolios, total });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// get biography by slug
const GetBiographyBySlug = async (req, res) => {
    try {
        const biography = await Biography.findOne({ slug: req.params.slug });
        return res.status(200).json({ biography });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// get portfolio by slug
const GetPortfolioBySlug = async (req, res) => {
    try {
        // Find the portfolio by slug
        const portfolio = await Portfolio.findOne({ slug: req.params.slug });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        // Find related projects
        const projects = await Project.find({ PortfolioId: portfolio._id });

        // Find related key aspects
        const keyaspects = await Keyaspects.find({ PortfolioId: portfolio._id });

        // Return portfolio, projects, and key aspects
        return res.status(200).json({ portfolio, projects, keyaspects });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// user can add review to biography
const AddReview = async (req, res) => {
    try {
        const { name, email, review, rating } = req.body;
        const newReview = new review({ name, email, review, rating });
        await newReview.save();
        return res.status(200).json({ message: "Review added successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const Subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email already exists
        const subscriber = await Subscribers.findOne({ email });
        if (subscriber) {
            return res.status(400).json({ message: "Email already exists", status: 400 });
        }

        // Create a new subscriber
        const newSubscriber = new Subscribers({ email });
        await newSubscriber.save();

        // Display all subscribers (for debugging purposes, can be removed in production)
        const displayall = await Subscribers.find();
        console.log(displayall);

        return res.status(200).json({ message: "Subscribed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// 5 top portfolios
const GetTopPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ listed: true }).sort({ rating: -1 }).limit(5);
        return res.status(200).json({ portfolios });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// search portfolios and biographies
// search portfolios and biographies
const Search = async (req, res) => {
    try {
        console.log("search");
        const { query } = req.query;
        console.log(query);

        // Ensure query is a string
        if (typeof query !== 'string') {
            return res.status(400).json({ message: "Query must be a string" });
        }

        // Search in category and title fields
        const searchCondition = {
            $or: [
                { category: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ]
        };

        const biographies = await Biography.find(searchCondition);
        const portfolios = await Portfolio.find(searchCondition);

        return res.status(200).json({ biographies, portfolios });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};
// return all the reviews and get banner from biograp
const GetReviews = async (req, res) => {
    try {
        const reviews = await review.aggregate([
            {
                $match: { approved: true }
            },
            {
                $lookup: {
                    from: "biographies", // The name of the Biography collection
                    localField: "biographySlug", // Field from the Review collection
                    foreignField: "slug", // Field from the Biography collection
                    as: "biographyDetails" // Output array field
                }
            },
            {
                $unwind: "$biographyDetails" // Deconstruct the array to include the biography details
            },
            {
                $project: {
                    review: 1,
                    reviewer: 1,
                    rating: 1,
                    date: 1,
                    biographySlug: 1,
                    approved: 1,
                    "biographyDetails.title": 1,
                    "biographyDetails.banner": 1, // Assuming 'banner' is the field name for the image
                    "biographyDetails.category": 1
                }
            }
        ]);

        return res.status(200).json({ reviews });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};
// fetch image
// send email using node mailer to all the subscribers
const SendEmail = async (req, res) => {
    try {
        const subscribers = await Subscribers.find();
        const emails = subscribers.map(subscriber => subscriber.email);
        console.log(emails);
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export default { GetBiographiesandPortfoliosforhome, GetBiographyandPortfoliooftheday, GetAllBiographies, GetAllPortfolios, GetPopularBiographies, GetBiographyBySlug, GetPortfolioBySlug, AddReview, Subscribe, GetTopPortfolios, Search, GetReviews, SendEmail ,ShowHeart };

