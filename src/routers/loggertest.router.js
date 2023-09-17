import { Router } from "express";
import logger from "../helpers/logger.js";

const router = Router()

router.get("/", async (request, response) => {
    logger.debug('prooving debug logger')
    logger.http('prooving http logger')
    logger.info('prooving info logger')
    logger.warning('prooving warning logger')
    logger.error('prooving error logger')
    logger.fatal('prooving fatal logger')
    response.send("test logger made successfully, see the console")
})

export default router