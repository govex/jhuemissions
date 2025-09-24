import cx from "classnames";
import styles from "./card.module.scss";

function Card({title, wraptitle=true, children} : {title: string, wraptitle?: boolean, children: any}) {
    return (
        <div className={styles.card}>
        <h2 className={cx(styles.cardtitle, wraptitle ? null : styles.oneline)}>{title}</h2>
        {children}
        </div>
    )
}

export default Card