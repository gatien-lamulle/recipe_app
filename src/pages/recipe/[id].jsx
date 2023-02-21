import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingPage from '@/components/LoadingPage';
import ImageBlurContainer from '@/components/ImageBlurContainer';

export default function Recipe() {
    const router = useRouter()

    const { id } = router.query;
    const [recipe, setRecipe] = useState(null);
    const measurementTranslate = { "grams": "g", "milliliters": "ml", "teaspoons": " CàC", "tablespoons": " CàS", "unit": "", "cups": "C" }

    const floatToFraction = (x) => {
      // Convert to string and split into integer and decimal parts
      const [int, dec] = x.toString().split('.');
      
      // If there is no decimal part, return the integer as a string
      if (!dec) {
        return int;
      }
      
      // Convert decimal part to a fraction
      let num = parseInt(dec);
      let den = 1;
      for (let i = 0; i < dec.length; i++) {
        den *= 10;
      }
      const gcd = greatestCommonDivisor(num, den);
      num /= gcd;
      den /= gcd;
      
      // Combine integer part and fraction part into a single string
      if (int === '0') {
        return `${num}/${den}`;
      } else {
        return `${x}`;
      }
    }
      
    // Helper function to find the greatest common divisor of two numbers
    const greatestCommonDivisor = (a, b) => {
      if (b === 0) {
        return a;
      }
      return greatestCommonDivisor(b, a % b);
    }
      

    useEffect(() => {
        fetch(`/api/recipe/${id}`).then(response => response.json())
            .then(response => {
                if (response.success) {
                    setRecipe(response.data);
                }
            }).catch(err => { console.error(err) });
    }, [id]);


    if (recipe === null) {
        return <LoadingPage />;
    }

    return (
        <main className="recipe_page">
            <div className="title_recipe">
                <h1>{recipe.title}</h1>
            </div>
            <div className="img_info">
                <div className="info_recipe">
                    <img src="/icons/time.svg" alt="time:" />
                    <p>{recipe.time} min</p>
                    <img src="/icons/serving.svg" alt="serving:" />
                    <p>{recipe.servings} pers</p>
                </div>
                <ImageBlurContainer className={`recipe_img ${recipe.description === "" && 'no_description'}`} image={recipe.image} alt={recipe.title}/>
                {/* <img className={`recipe_img ${recipe.description === "" && 'no_description'}`} src={recipe.image} alt={recipe.title} /> */}
            </div>
            {recipe.description !== "" &&
                <p className="recipe_description">
                    {recipe.description}
                </p>
            }
            <div className="ingredients">
                <h2>Ingredients : </h2>
                <ul>
                    {recipe.ingredients.map(ingredient => {
                        let m = measurementTranslate[ingredient.measurement];
                        return <li key={ingredient._id}><span>{`${ingredient.quantity > 0 ? floatToFraction(ingredient.quantity) : ''}${m} ${ingredient.name}`}</span></li>;
                    })}
                </ul>
            </div>
            <div className="steps">
                <h2>Etapes : </h2>
                <ol>
                    {recipe.steps.map((step, idx) => {
                        return <li key={idx}><span>{step}</span></li>;
                    })}
                </ol>

            </div>
        </main>
    )
}