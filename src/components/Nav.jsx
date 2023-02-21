import React, { useEffect, useState } from 'react';
// import { Link, Route, Switch } from 'react-router-dom';
import Link from 'next/link';
import Image from 'next/image';
import Autosuggest from 'react-autosuggest';
import { useRouter } from 'next/router';


export default function Nav(props) {

    const { pathname } = useRouter();

    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState("");
    const [hiddenSearchBar, setHiddenSearchBar] = useState(false);

    useEffect(() => {
        setHiddenSearchBar(window.innerWidth <= 800);
        function handleResize() {
            setHiddenSearchBar(window.innerWidth <= 800);
        }
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, [])


    const doSearch = ({ value, reason }) => {
        fetch(`/api/recipe/search/${value}`).then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.success) {
                    setSearchResult(response.data);
                }
            }).catch(err => console.error(err));
    }

    const renderSuggestion = suggestion => (
        <Link href={`/recipe/${suggestion._id}`} style={{ textDecoration: 'none' }}>
            <div className="search_result">
                <img className="search_result_img" src={suggestion.image} alt={suggestion.title} />
                <h4 className="search_result_title">{suggestion.title}</h4>
            </div>
        </Link>
    );

    const handleClickSearchIcon = () => {
        setHiddenSearchBar(!hiddenSearchBar);
    }

    return (
        <header className="navbar">
            {pathname.includes("recipe") || pathname.includes("newRecipe") ? 
                <Link href="/">
                    <img className="left_img" src="/icons/back.svg" alt="Retour" width="50" />
                </Link>
            :
                <Link href="/newRecipe">
                    <img className="left_img" src="/icons/plus.svg" alt="Nouvelle Recette" width="50" />
                </Link>
            }
            <h1>Recipe App</h1>
            <img onClick={handleClickSearchIcon} className="right_img" src="/icons/search.svg" alt="Recherche" />
            <Autosuggest suggestions={searchResult} onSuggestionsFetchRequested={doSearch}
                onSuggestionsClearRequested={() => setSearchResult([])} getSuggestionValue={(suggestion) => suggestion.title}
                onSuggestionSelected={(e, {suggestionValue}) => setSearch(suggestionValue)} renderSuggestion={renderSuggestion} 
                inputProps={{
                    value: search, onChange: (e) => setSearch(e.target.value),
                    placeholder: "Rechercher une recette", hidden: hiddenSearchBar
                }}/>
        </header>
    )
}