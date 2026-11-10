import express from "express";
import * as medicaController from "../controllers/medicaController";
const medicaRouter = express.Router();
medicaRouter.route("/traertodos").get(medicaController.traertodos  );

export default medicaRouter;