import express from "express";
import * as medicaController from "../controllers/medicaController";
const medicaRouter = express.Router();
medicaRouter.route("/traertodos").post(medicaController.traertodos  );

export default medicaRouter;