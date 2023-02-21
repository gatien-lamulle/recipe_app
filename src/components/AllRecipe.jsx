import React, { useEffect, useState } from 'react';

import LoadingPage from './LoadingPage.jsx';
import Thumbnail from './Thumbnail.jsx';

export default function AllRecipes(props) {

    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        // console.log(process.env.REACT_APP_SERVER_HOST);
        fetch(`/api/recipe`).then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.success) {
                    setRecipes(response.data);
                }
            }).catch(err => { console.error(err) });
    }, []);

    if (recipes.length === 0) {
        return <LoadingPage />
    }

    return (
        <div className="recipe_list">
            {recipes.map((recipe) => {
                return <Thumbnail recipe={recipe} key={recipe._id} />
            })}

        </div>
    )

}
