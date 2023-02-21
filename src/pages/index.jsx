import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import AllRecipes from '@/components/AllRecipe'

export default function Home() {
  return (
      <main className={styles.page_body}>
        <AllRecipes/>
      </main>
  )
}
