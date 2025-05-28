import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUser } from '../schemas/userSchema';
import { isAdmin } from '../middlewares/isAdmin';
import userRoutes from './user.routes'; 
import ApiLog from '../models/ApiLog';
import { LoginController } from '../controllers/login.controller';

const router = Router();
const loginController = new LoginController();

router.get('/logs', async (req, res) => {
    const logs = await ApiLog.find({});
    let formatted: { [key: string]: any } = {};
    logs.forEach(log => {
        formatted[log.path] = log.count;
    });
    res.json(formatted);
});

router.use('/user', userRoutes);
router.post('/login', loginController.login.bind(loginController));
router.post('/logout', loginController.logout.bind(loginController));

export default router;