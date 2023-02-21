import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Thumbnail(props) {
    return (
        <section className="recipe_preview">
            <Link href={`/recipe/${props.recipe._id}`} className="thumbnail_link">
                <div className="info_recipe">
                    <img src="/icons/time.svg" alt="time:" />
                    <p>{props.recipe.time} min</p>
                    <img src="/icons/serving.svg" alt="serving:" />
                    <p>{props.recipe.servings} pers</p>
                </div>
                <div className="title_recipe">
                    <p>{props.recipe.title}</p>
                </div>
                <img className="recipe_img" src={props.recipe.image} alt={props.recipe.title} />
            </Link>
        </section>
    )
}