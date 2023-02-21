import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Recipe = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    ingredients: {type: [{
        name: {type: String, required: true},
        quantity: {type: Number, required: true},
        measurement: {type: String, enum: ["grams", "milliliters", "teaspoons", "tablespoons", "cups", "unit"], required: true}
    }], required: true},
    time: {type: Number, required: true}, //En minute
    servings: {type: Number, required: true, min: 2, max: 10},
    steps: {type: [String], required: true},
    image: {type: String, required: true},
    date: {type: Date, default: Date.now}
}, {versionKey: false});


module.exports = mongoose.models.Recipe || mongoose.model('Recipe', Recipe);