import express from 'express';
import * as usuController from '../controllers/usuController';
const usuRouter = express.Router();
usuRouter.route("/validar").get(usuController.validar  );
usuRouter.route("/logout").post(usuController.logout  );
usuRouter.route("/datos").get(usuController.datos  );
usuRouter.route("/pwdUpdate").put(usuController.pwdUpdate  );
usuRouter.route("/userLogged").get(usuController.userLogged  );
usuRouter.route("/validToken").get(usuController.validToken  );



export default usuRouter;