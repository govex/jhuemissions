import styles from "./card.module.scss";

function Card({title, children} : {title: string, children: any}) {
    return (
        <div className={styles.card}>
        <h2 className={styles.cardtitle}>{title}</h2>
        {children}
        </div>
    )
}

export default Card