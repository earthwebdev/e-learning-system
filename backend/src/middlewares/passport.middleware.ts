import passport from "passport";
import { Strategy} from 'passport-google-oauth20';
import UserModel from "../models/users.model";

const clientID = process.env.GOOGLE_CLIENT_ID ?? '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';

export const passportInitialize = () => {      
    passport.use(new Strategy({
      clientID,
      clientSecret,
      callbackURL: "/auth/google/callback"
    },
    async function(accessToken: string, refreshToken: string, profile: any, cb: any) {
      /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      }); */
      const existingUsers: any = await UserModel.findOne({email:profile['_json'].email});
      if(existingUsers){
        cb(null, existingUsers);
      } else {
        const data = {
          fullName: profile['_json'].name,
          email: profile['_json'].email,
          //jwt: profile['_json'].jwt,

        }
        const user = new UserModel(data);
        await user.save({validateBeforeSave: false}); 

        cb(null, profile);
      }
      
    }
  ));

  passport.serializeUser( (user: Object, done:any) => {
      done(null, user);
  });

  passport.deserializeUser( (user: Object, done:any) => {
      done(null, user);
  })
}

export default passport;