import React from "react"
import Loader from "react-spinners/PropagateLoader";
import styles from "@/styles/LoadingPage.module.css";
import Image from "next/image";

export default function LoadingPage() {
    return (
        <div className={styles.loading_page}>
            <img src="/loading.svg" alt="Loading...." className={styles.loading_img}/>
            <Loader color="#a0d468" size={10}/>
        </div>
    )
}