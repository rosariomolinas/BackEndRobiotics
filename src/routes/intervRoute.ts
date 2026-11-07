import express from "express";
import * as intervController from "../controllers/intervController";
const intervRouter = express.Router();
intervRouter.route("/addnew").post(intervController.addnew  );
intervRouter.route("/findcode").post(intervController.findCode  );
intervRouter.route("/traertodos").post(intervController.traertodos  );
intervRouter.route("/traeralgunos").post(intervController.traeralgunos  );



export default intervRouter;