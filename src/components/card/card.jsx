import styles from "./card.module.scss";

function Card({title, children}) {
    return (
        <div className={styles._card}>
        <h3>{title}</h3>
        {children}
        </div>
    )
}

export default Card