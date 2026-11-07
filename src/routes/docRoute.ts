import express from 'express';
import * as docController from "../controllers/doctorController";
const docRouter = express.Router();
docRouter.route("/addnew").post(docController.addnew  );

docRouter.route("/findcode").post(docController.findCode  );
docRouter.route("/findname").post(docController.findName  );
docRouter.route("/findall").post(docController.findAll  );
docRouter.route("/update").post(docController.update  );
docRouter.route("/next").post(docController.next  );
docRouter.route("/previous").post(docController.previous  );
docRouter.route("/remove").post(docController.remove  );
export default docRouter;