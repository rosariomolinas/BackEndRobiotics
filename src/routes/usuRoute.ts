import express from 'express';
import * as usuController from '../controllers/usuController';
const usuRouter = express.Router();
usuRouter.route("/validar").post(usuController.validar  );
usuRouter.route("/logout").post(usuController.logout  );
usuRouter.route("/datos").post(usuController.datos  );
usuRouter.route("/pwdUpdate").post(usuController.pwdUpdate  );
usuRouter.route("/userLogged").post(usuController.userLogged  );
usuRouter.route("/validToken").post(usuController.validToken  );



export default usuRouter;