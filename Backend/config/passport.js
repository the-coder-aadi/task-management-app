import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import usermodel from "../models/model.js";

passport.use(new GoogleStrategy(
    {
        clientID:process.env.google_client_id,
        clientSecret:process.env.google_client_secret,
        callbackURL:process.env.google_callback_url
    },
    async (accesstoken, refreshtoken, profile,done)=>{
        try {
            console.log(accesstoken)
    const email = profile.emails[0].value
    let finduser = await usermodel.findOne({email})
      if (!finduser) {
    finduser = await usermodel.create({
        name: profile.displayName,
        email,
        googleId: profile.id,
        image: profile.photos?.[0]?.value,
        provider: "google",
    });
} else {
    // Existing local account ko Google se link karo
    if (!finduser.googleId) {
        finduser.googleId = profile.id;
        finduser.image = profile.photos?.[0]?.value;
        finduser.provider = "google"

        await finduser.save();
    }
}
        done(null, finduser)
          } catch (error) {
            done(error, null)
        }
    }
))
