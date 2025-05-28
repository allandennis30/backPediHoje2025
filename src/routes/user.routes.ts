import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUser } from '../schemas/userSchema';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();
const controller = new UserController();

router.post('/create', controller.create.bind(controller));
router.get('/all', isAdmin, controller.getAll.bind(controller));

export default router;