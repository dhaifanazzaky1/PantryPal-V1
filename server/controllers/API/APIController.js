const { SavedRecipe } = require("../../models");
const axios = require("axios");
const { GoogleGenAI } =  require ("@google/genai");

class HController {
  static async fetchDataHome(req, res, next) {
    try {
      let { search, page } = req.query;

      if (!Number(page)) {
        page = 1;
      }
      page = Number(page);

      const limit = 20;

      // pagination
      const offset = (page - 1) * limit;
      const response = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        {
          params: {
            apiKey: process.env.SPOONACULAR_API_KEY,
            number: limit,
            offset: offset,
            addRecipeInformation: true,
            ...(search && {
              query: search,
            }),
          },
        },
      );

      const data = response.data;

      const result = {
        message: "succeed read recipes",
        total: data.totalResults,
        size: limit,
        totalPage: Math.ceil(data.totalResults / limit),
        currentPage: page,
        data: data.results,
      };

      res.status(200).json(result);
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
  
  static async getDetail(req, res, next) {
    try {
      const { id } = req.params;

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        {
          params: {
            apiKey: process.env.SPOONACULAR_API_KEY,
          },
        },
      );

      const data = response.data;

      const recipe = {
        id: data.id,
        title: data.title,
        image: data.image,
        readyInMinutes: data.readyInMinutes,
        servings: data.servings,
        summary: data.summary,
      };

      const ingredients = data.extendedIngredients.map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        original: item.original,
      }));

      const instructions = data.analyzedInstructions.flatMap((group) =>
        group.steps.map((step) => ({
          number: step.number,
          step: step.step,
        })),
      );

      res.status(200).json({
        recipe,
        ingredients,
        instructions,
      });
    } catch (error) {
      if (error.response?.status === 404) {
        throw { name: "NotFound" };
      }

      next(error);
    }
  }

  
}

module.exports = HController;
