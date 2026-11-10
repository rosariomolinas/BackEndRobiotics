import express from "express";
import * as docController from '../controllers/docController';

const docRouter = express.Router();

docRouter.route("/findcode").get(docController.findCode);
docRouter.route("/findname").get(docController.findName);
docRouter.route("/findall").get(docController.findAll);
docRouter.route("/addnew").post(docController.addnew);
docRouter.route("/update").put(docController.update);
docRouter.route("/remove").delete(docController.remove);

export default docRouter;


// import express from 'express';
// import * as docController from "../controllers/docController";
// const docRouter = express.Router();
// docRouter.route("/addnew").post(docController.addnew  );

// docRouter.route("/findcode").get(docController.findCode  );
// docRouter.route("/findname").get(docController.findName  );
// docRouter.route("/findall").get(docController.findAll  );
// docRouter.route("/update").put(docController.update  );
// docRouter.route("/next").get(docController.next  );
// docRouter.route("/previous").get(docController.previous  );
// docRouter.route("/remove").delete(docController.remove  );
// export default docRouter;