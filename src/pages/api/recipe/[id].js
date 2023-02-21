import dbConnect from '@/lib/dbConnect'
import recipeModel from '@/schemas/Recipe'

export default async function handler (req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        let recipeId = req.query.id;
        recipeModel.findById(recipeId).then((result) => {
            res.status(200).json({ success: true, data: result})
        })
      } catch (error) {
        res.status(400).json({ success: false, message: "Error during the recipes recuperation", error})
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}