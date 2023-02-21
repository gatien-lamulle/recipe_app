import React, { useState } from 'react';
import Dropzone from 'react-dropzone-uploader';
import TextareaAutosize from 'react-textarea-autosize';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import 'react-dropzone-uploader/dist/styles.css'
import LoadingPage from '@/components/LoadingPage';
import StorageClient from '@/utils/StorageClient';
import ImageBlurContainer from '@/components/ImageBlurContainer';
import { filterXSS } from 'xss';

export default function NewRecipe() {

    const router = useRouter()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [metaImg, setMetaImg] = useState(null);
    const [time, setTime] = useState(45);
    const [servings, setServings] = useState(4);
    const [ingredients, setIngredients] = useState([{"key": uuid(),"name": "","quantity": 1,"measurement": "unit"}])
    const [steps, setSteps] = useState([{"key": uuid(), "value": ""}]);
    const [loading, setLoading] = useState(false);


    const handleChangeStatus = ({ meta, file }, status) => {
        if (status === "done") {
            let img = file;
            let imgDOM = document.getElementsByClassName("dropzone")[0];
            console.log(meta.previewUrl);
            setImage(img);
            setMetaImg(meta);
        } else if (status === "removed") {
            // setPreviewHeight(null)
            setImage("");
        }
    }

    const onChangeIngredients = ({value}, field, index) => {
        value = filterXSS(value);
        if (field === 'quantity') {
            value = parseFloat(value);
        }
        ingredients[index][field] = value;
        setIngredients([...ingredients]);
    }

    const addIngredient = () => {
        setIngredients([...ingredients, {"key": uuid(), "name": "","quantity": 1,"measurement": "unit"}]);
    }

    const removeIngredient = (index) => {
        let newIngredients = ingredients;
        newIngredients.splice(index, 1);
        setIngredients([...newIngredients]);
    }

    const onChangeSteps = ({value}, index) => {
        value = filterXSS(value);
        steps[index].value = value;
        setSteps([...steps]);
    }

    const addStep = () => {
        setSteps([...steps, {"key": uuid(), "value": ""}]);
    }

    const removeStep = (index) => {
        let newSteps = steps;
        newSteps.splice(index, 1);
        setSteps([...newSteps]);
    }

    const addRecipe = () => {

        if (!title || !image || !ingredients.every(i => i.name && i.measurement && i.quantity) || !steps.every(s => s)) {
            toast.error("Attention, aucun champs à part description ne peut être vide !");
            return;
        }
        console.log(image);
        setLoading(true);
        new StorageClient().storeFiles(image).then(imageUrl => {
            console.log(imageUrl);
            const newRecipe = {
                title,
                description,
                time,
                servings,
                ingredients: ingredients,
                steps: steps.map(step => step.value),
                image: imageUrl
            }
            fetch(`/api/recipe`, {
                    method: 'POST',
                    body: JSON.stringify(newRecipe),
                    headers: {
                        "content-type": "application/json"
                    }
                }).then(response => response.json())
                .then(response => {
                if (response.success) {
                    toast.success("La recette a été ajoutée !");
                    router.push('/');
                } else {
                    toast.error(`Erreur pendant l'ajout de la recette, veuillez réessayer plus tard. (${response.status})`);
                    setLoading(false);
                }
            }).catch(err => {
                toast.error(`Erreur pendant l'ajout de la recette, veuillez réessayer plus tard. (${err}))`);
                console.error(err);
                setLoading(false);
            });
        }).catch(err => {
            toast.error(`Erreur pendant l'ajout de la recette, veuillez réessayer plus tard. (${err}))`);
            console.error(err);
            setLoading(false);
        });
        
    }

    if (loading) {
        return <LoadingPage/>
    }

    return (
        <main className="recipe_page">
            <div className="title_recipe">
                <input placeholder="Titre" value={title} onChange={(e) => setTitle(filterXSS(e.target.value))}></input>
            </div>
            <div className="img_info2">
                <div className="info_recipe">
                    <img src="/icons/time.svg" alt="time:" />
                    <input type="number" min="1" value={time} onChange={(e) => setTime(parseInt(filterXSS(e.target.value)))} placeholder="10"></input><p>min</p>
                    <img src="/icons/serving.svg" alt="serving:" />
                    <input type="number" min="1" value={servings} onChange={(e) => setServings(parseInt(filterXSS(e.target.value)))} placeholder="4"></input>
                </div>

                <Dropzone accept="image/*" maxFiles={1} canCancel={true} inputContent="Ajouter une image"
                    onChangeStatus={handleChangeStatus} submitButtonDisabled={true}
                    PreviewComponent={ImageBlurContainer}
                    addClassNames={{
                        inputLabel: "dropzone_inputLabel",
                        dropzone: "dropzone",
                    }}
                    classNames={{
                        previewImage: "dropzone_previewImage",
                    }} />
            </div>

            <TextareaAutosize minRows={4} value={description} onChange={(e) => setDescription(filterXSS(e.target.value))} className="recipe_description" placeholder="Description (facultatif)" />
            <div className="ingredients">
                <h2>Ingredients : </h2>
                <ul>
                    {ingredients.map((ingredient, idx) => {
                        return (<li key={ingredient.key}>
                            <input placeholder="Ingredient" value={ingredient.name} onChange={(e) => onChangeIngredients(e.target, "name", idx)}/>
                            <input className="quantity" min="0.5" max="9999" placeholder="1" step="0.5" type="number" value={ingredient.quantity}
                             onChange={(e) => onChangeIngredients(e.target, "quantity", idx)}></input>
                            <select name="" id="" value={ingredient.measurement} onChange={(e) => onChangeIngredients(e.target, "measurement", idx)}>
                                <option value="grams">grammes</option>
                                <option value="milliliters">millilitres</option>
                                <option value="unit">unités</option>
                                <option value="teaspoons">cuillere à café</option>
                                <option value="tablespoons">cuillere à soupe</option>
                            </select>
                            {idx > 0 && <button className="btn_minus" onClick={() => removeIngredient(idx)}>-</button>}
                        </li>);
                    })}
                    <button className="btn_plus" onClick={addIngredient}>+</button>

                </ul>
            </div>
            <div className="steps">
                <h2>Etapes : </h2>
                <ol>
                    {steps.map((step, idx) => {
                        return (<li key={step.key}>
                            <TextareaAutosize placeholder={`Etape ${idx + 1}`} value={step.value} 
                            onChange={(e) => onChangeSteps(e.target, idx)}/>
                            {idx > 0 && <button className="btn_minus" onClick={() => removeStep(idx)}>-</button>}
                        </li>);
                    })}
                    <button className="btn_plus" onClick={addStep}>+</button>
                </ol>
            </div>

            <button className="add_recipe" onClick={addRecipe}>Ajouter la recette !</button>
        </main>
    )
}