import express, {Request, Response} from 'express';
import passport from 'passport';
const router = express.Router();
import jwt from 'jsonwebtoken';

//router.get('/auth/google', passport.authenticate('google')); ///login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('login/failed', (req: Request, res: Response) => {
    res.status(401).json({
        message: 'Unauthorized User',
    })

})
router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err:any, user: any) => {
        if(err){            
            return next(err);
        }
        //next();
        const secretKey: string = process.env.JWT_SECRT_KEY ?? '';

        const token: any = jwt.sign(user["_json"].email, secretKey);
        res.cookie('jwtToken', token);
        res.redirect(`${process.env.CLIENT_URL}/dashboard`)
    })(req, res, next)
})
/* router.get('/auth/google/callback', passport.authenticate('google',  {
        successRedirect: process.env.CLIENT_URL+'/dashboard',
        failureRedirect: '/login/failed'
    })
); */
export default router;