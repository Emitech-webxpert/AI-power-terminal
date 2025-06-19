import express from "express";
import { sshConnection } from "@controllers/index";


const router = express.Router();

router.post('/createConnection', sshConnection.createConnection)
router.get('/getConnection', sshConnection.createConnection)
router.delete('/deleteConnection/:id', sshConnection.deleteConnection)
router.post('/searchConnection/:id', sshConnection.searchConnections)
router.get('/getConnectionById/:id', sshConnection.getConnectionById)

export default router