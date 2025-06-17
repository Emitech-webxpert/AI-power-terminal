import express from "express";
import { sshConnectionController} from "@controllers/index";


const router = express.Router();

router.post('/createConnection', sshConnectionController.createConnection)
router.get('/getConnection', sshConnectionController.getAllConnections)
router.delete('/deleteConnection/:id',sshConnectionController.deleteConnection)
router.post('/searchConnection/:id',sshConnectionController.searchConnections)
router.get('/getConnectionById/:id',sshConnectionController.getConnectionById)

export default router