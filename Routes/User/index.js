import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import BiographyController from "../../Controllers/User/Biographycontroller.js";
import e from "express";
import axios from "axios";

const router = express.Router();
router.use(cookieParser());

router.get("/home/portfolioandbiographyoftheday", BiographyController.GetBiographyandPortfoliooftheday);
router.get("/biography/heart", BiographyController.ShowHeart);
router.get("/biographiesandportfolios", BiographyController.GetBiographiesandPortfoliosforhome);
router.get("/biographyandportfoliooftheday", BiographyController.GetBiographyandPortfoliooftheday);
router.get("/allbiographies", BiographyController.GetAllBiographies);
router.get("/allportfolios", BiographyController.GetAllPortfolios);
router.get("/biography/:slug", BiographyController.GetBiographyBySlug);
router.get("/portfolio/:slug", BiographyController.GetPortfolioBySlug);

router.get("/home/biographiesandportfolios", BiographyController.GetBiographiesandPortfoliosforhome);
router.post("/biography/review", BiographyController.AddReview);
router.post("/biography/subscribe", BiographyController.Subscribe );
router.get("/popularbiographies", BiographyController.GetPopularBiographies);
router.get("/popularportfolios", BiographyController.GetTopPortfolios);
router.get("/reviews", BiographyController.GetReviews);
// send email to all teh subscribers

router.post('/fetch-image', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      
      res.set('Content-Type', response.headers['content-type']);
      res.send(response.data);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Error fetching image');
    }
  });
router.get("/search", BiographyController.Search);
export default router;
