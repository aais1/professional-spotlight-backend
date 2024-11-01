import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import AdminController from "../../Controllers/Admin/authcontroller.js";
import Functionalcontroller from "../../Controllers/Admin/Biographyadmincontroller.js";
import ReviewController from "../../Controllers/Admin/Reviewadmincontroller.js";
import PortfolioController from "../../Controllers/Admin/portfolioadmincontroller.js";
import nodemailer from 'nodemailer';
import Biography from "../../Models/Biogrphies/biography.js";
import Biographyadmincontroller from "../../Controllers/Admin/Biographyadmincontroller.js";

const router = express.Router();
router.use(cookieParser());
// Login function with JWT token in cookies

router.get("/biography/heart", Biographyadmincontroller.GetHeartedBiographies);
router.post("/biography/unlike", Biographyadmincontroller.UnlikeBiography);

router.post("/biography/heart", Biographyadmincontroller.AddToHeart);

router.post("/login", AdminController.login);
// update password function
router.put("/Password", AdminController.updatePassword);
// create biography
router.post("/biography", Functionalcontroller.createBiography);
// update biography
// router.put("/biography", Functionalcontroller.updateBiography);
// create biography description
router.post("/biography/description", Functionalcontroller.BiographyDescription);
// create biography images
router.post("/biography/images", Functionalcontroller.BiographyImages);
// update listed 
router.put("/biography/listed", Functionalcontroller.ListBiography);
// update biography of the day
router.put("/biography/biographyoftheday", Functionalcontroller.BiographyOfTheDay);
// get all biographies
router.get("/biographies", Functionalcontroller.GetBiographies);
//  get images and description of a biography
router.get("/biography/:title", Functionalcontroller.getimagesanddescription);
//  delete biography
router.delete("/biography/:id", Functionalcontroller.deletebiography);
//delete image
router.post("/biography/deleteimage", Functionalcontroller.deleteImage);
//  get all reviews
router.get("/reviews", ReviewController.getAllReviews);
// create review
router.post("/review", ReviewController.createReview);
// update review
router.put("/review", ReviewController.updateReview);
// approve review
router.put("/review/approve/:reviewId", ReviewController.approveReview);
//reject review
router.delete("/review/reject/:reviewId", ReviewController.rejectReview);
// get all biographies titles
router.get("/biographies/titles", Functionalcontroller.GetBiographiesTitles);
// get all approved reviews
router.get("/reviews/approved", ReviewController.getApprovedReviews);
// portfolio routes 
// create portfolio
router.post("/portfolio", PortfolioController.createPortfolio);
// add project to portfolio
router.post("/portfolio/project", PortfolioController.addproject);
// add key aspect to portfolio
router.post("/portfolio/keyaspect", PortfolioController.addkeyaspect);
// listed portfolio status 
router.put("/portfolio/listed", PortfolioController.updatelisted);
// get all portfolios
router.get("/portfolios", PortfolioController.getallportfolio);
// get projects and keyaspect of a portfolio
router.get("/portfolio/:portfolioId", PortfolioController.getprojectsandkeyaspectsbyportfolioid);
// edit project
router.put("/portfolio/project", PortfolioController.editproject);
// edit portfolio
router.put("/portfolio/:portfolioId", PortfolioController.editportfolio);
// edit keyaspect
router.put("/portfolio/keyaspect", PortfolioController.editkeyaspect);
// delete keyaspect
router.delete("/portfolio/keyaspect/:keyaspectId", PortfolioController.deletekeyaspect);
// portfolio of the week
router.put("/portfolio/portfoliooftheweek/:portfolioId", PortfolioController.portfoliooftheweek);
// delete portfolio 
router.delete("/portfolio/:portfolioId", PortfolioController.deleteportfolio);
// get tesitng route
router.get("/testing/:slug", Biographyadmincontroller.TestingBiography);





// send email to all the subscribers



export default router;
