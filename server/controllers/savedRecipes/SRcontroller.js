const { SavedRecipe } = require("../../models");
const axios = require("axios");

class SRController {
  static async create(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      const { spoonacularId, title, imageUrl } = req.body;

      const savedRecipe = await SavedRecipe.create({
        userId,
        spoonacularId,
        title,
        imageUrl,
      });

      res.status(201).json({
        message: "succeed saved recipes",
        data: savedRecipe,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  static async getdata(req, res, next) {
    try {
      const { userId } = req.loginInfo;

      const savedRecipes = await SavedRecipe.findAll({
        where: {
          userId,
        },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(savedRecipes);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const { id } = req.params;
      const savedRecipe = await SavedRecipe.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!savedRecipe) {
        throw {
          name: "NotFound",
        };
      }

      await savedRecipe.destroy();

      res.status(200).json({
        message: "Recipe removed from saved",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async getDetail(req, res, next) {
    try {
      const { userId } = req.loginInfo;
      const { id } = req.params;

      // cari data saved milik user
      const savedRecipe = await SavedRecipe.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!savedRecipe) {
        throw { name: "NotFound" };
      }

      // ambil recipeId dari database
      const spoonacularId = savedRecipe.spoonacularId;

      // request ke Spoonacular
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${spoonacularId}/information`,
        {
          params: {
            apiKey: process.env.SPOONACULAR_API_KEY,
          },
        },
      );

      const data = response.data;

      res.status(200).json({
        id: data.id,
        title: data.title,
        image: data.image,
        readyInMinutes: data.readyInMinutes,
        servings: data.servings,
        summary: data.summary,
        ingredients: data.extendedIngredients,
        instructions: data.analyzedInstructions,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
}

module.exports = SRController;
