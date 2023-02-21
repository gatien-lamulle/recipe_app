import dbConnect from '@/lib/dbConnect'
import recipeModel from '@/schemas/Recipe'

export default async function handler (req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        recipeModel.find({}, "_id title time servings image").then((result) => {
            res.status(200).json({ success: true, data: result})
        })
      } catch (error) {
        res.status(400).json({ success: false, message: "Error during the recipes recuperation", error})
      }
      break
    case 'POST':
      try {
        console.log("IN", req.body);
        let data = req.body;
        let new_recipe = new recipeModel();
        let { title, description, ingredients, time, servings, steps, image } = data;
        new_recipe.title = title;
        new_recipe.description = description;
        new_recipe.ingredients = ingredients;
        new_recipe.time = time;
        new_recipe.servings = servings;
        new_recipe.steps = steps;
        new_recipe.image = image;
        console.log(new_recipe, new_recipe.ingredients, new_recipe.steps, typeof new_recipe.servings, typeof new_recipe.time);
        new_recipe.save((err, result) => {
            if (!err) {
              res.status(200).json({ success: true, data: result})
            } else {
              res.status(400).json({ success: false, message: "Error during the insertion in the database", error: err})
            }
        });
        // storage.uploadData(image).then(id => {
        //     if (id === undefined) {
        //         res.statusCode = 400;
        //         res.json({ "message": "Error during the insertion in the database", "error": err });
        //         return;
        //     }
        //     new_recipe.title = title;
        //     new_recipe.description = description;
        //     new_recipe.ingredients = ingredients;
        //     new_recipe.time = time;
        //     new_recipe.servings = servings;
        //     new_recipe.steps = steps;
        //     new_recipe.image = id;

        //     new_recipe.save((err, result) => {
        //         if (!err) {
        //             res.statusCode = 200;
        //             res.json(result);
        //         } else {
        //             res.statusCode = 400;
        //             res.json({ "message": "Error during the insertion in the database", "error": err });
        //         }
        //     });
        // });
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}