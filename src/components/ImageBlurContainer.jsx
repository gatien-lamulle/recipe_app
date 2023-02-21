import React, { useEffect } from "react"
import styles from "@/styles/ImageBlurContainer.module.css"

export default function ImageBlurContainer(props) {

    useEffect(() => {
        console.log(props.file, props.meta);
    }, [])
    
    return (
        <div className={props.className}>
            <div className={styles.img_container}>
                <img src={props.image || props.meta.previewUrl} alt={props.alt} className={styles.img_blur} aria-hidden="true"/>
                <img src={props.image || props.meta.previewUrl} alt={props.alt}/>
            </div>
        </div>
    )
}