import express from "express";
import * as intervController from "../controllers/intervController";
const intervRouter = express.Router();
intervRouter.route("/addnew").post(intervController.addnew  );
intervRouter.route("/findcode").get(intervController.findCode  );
intervRouter.route("/traertodos").get(intervController.traertodos  );
intervRouter.route("/traeralgunos").get(intervController.traeralgunos  );



export default intervRouter;