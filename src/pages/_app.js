import '@/styles/globals.css'
import '@/styles/AllRecipes.css'
import '@/styles/Nav.css'
import '@/styles/NewRecipe.css'
import '@/styles/Recipe.css'
import '@/styles/Thumbnail.css'
import Nav from '@/components/Nav'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
        <title>Recipes App</title>
        <meta property="og:title" content="Recipes App" key="title" />
        <meta name="description" content="A website to share and read recipes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav/>
      <Component {...pageProps} />
      <Toaster/>
  </>
  )
}
