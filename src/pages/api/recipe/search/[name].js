import dbConnect from '@/lib/dbConnect'
import recipeModel from '@/schemas/Recipe'

export default async function handler (req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      console.log("search");
      try {
        let recipeName = req.query.name;
        console.log(recipeName, "search");
        recipeModel.find({ "title": { "$regex": `(^${recipeName}|( |-)${recipeName})`, "$options": "i" } }, "_id title time servings image").then(result => {
          res.status(200).json({ success: true, data: result})
          res.end();
        });
      } catch (error) {
        res.status(400).json({ success: false, message: "The recipe has not been founded", error})
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}