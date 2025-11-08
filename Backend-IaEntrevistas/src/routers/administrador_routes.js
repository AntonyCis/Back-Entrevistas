import {Router} from 'express'
import { confirmarMail,registro } from '../controllers/administrador_controller.js'
const router = Router()


router.post('/registro',registro)
router.get('/confirmar/:token',confirmarMail)


export default router