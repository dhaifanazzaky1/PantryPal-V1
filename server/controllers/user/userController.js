
const { compPW } = require("../../helpers/bcrypt");
const { signToken, verifToken } = require("../../helpers/jwt");
const { SavedRecipe, User } = require("../../models");
const ImageKit = require("@imagekit/nodejs");

class uController {
  static async register(req, res, next) {
    try {
      const { username, email, password, avatarUrl } = req.body;
      // console.log(req.body);

      let data = await User.create({
        username,
        email,
        password,
        avatarUrl,
      });
      res.status(201).json({
        message: "succeed to register",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      let cekEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (!cekEmail) {
        throw { name: "noEmail" };
      }

      if (!compPW(password, cekEmail.password)) {
        throw { name: "invalidPW" };
      }

      const payload = {
        id: cekEmail.id,
        email: cekEmail.email,
        name: cekEmail.username,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      next(error);

      // res.send(error)
      console.log(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw { name: "NotFound" };
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      console.log("123");
      const { OAuth2Client } = require("google-auth-library");
      const client = new OAuth2Client();
      const { token } = req.headers;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTID_KEY,
      });
      const gpayload = ticket.getPayload();
      console.log(gpayload);
      
      const [user, created] = await User.findOrCreate({
        where: { email: gpayload.email },
        defaults: {
          email: gpayload.email ,
          username : gpayload.name,
          password : "123123123"
        },
      });

      const payload = {
        id: user.id,
        email: user.email,
        name: user.username,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token
      });


    } catch (error) {
      next(error);
    }
  }

  static async patchImg(req, res, next) {
    try {
      if (!req.file) {
        throw { name: "BadRequestpho" };
      }

      const client = new ImageKit({
        privateKey: process.env.IMAGEKIT_KEY,
      });
      const result = await client.files.upload({
        file: await ImageKit.toFile(Buffer.from(req.file.buffer), "file"),
        fileName: req.file.originalname,
      });

      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        throw { name: "NotFound" };
      }

      await user.update({ avatarUrl: result.url });
      // console.log("masuk");

      res.status(200).json({
        message: `image ${user.email} success to update`,
        data: result.url,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  static async patchName(req, res, next) {
  try {
    const { username } = req.body;
    const { id } = req.params;

    if (!username) {
      throw {
        name: "BadRequestName"
      };
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw {
        name: "NotFound",
      };
    }

    await user.update({
      username,
    });

    res.status(200).json({
      message: `username ${user.email} success to update`,
      data: user.username,
    });
  } catch (error) {
    next(error);
  }
}
}

module.exports = uController;
