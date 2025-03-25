import { Link } from 'react-router'
import { ReactComponent as RightArrow } from "../icons/right-arrow";
import { ReactComponent as ChevronDown } from "../icons/chevron-down";
import { ReactComponent as ArrowUpCircle } from "../icons/arrow-up-circle";
import { ReactComponent as CloseX } from "../icons/close-x";
import cx from "classnames";
import styles from "./button.module.scss"

const Button = ({ 
    type="solid", 
    icon=undefined, 
    text=undefined, 
    color="primary", 
    size="small", 
    onClick=undefined,
    href=undefined
}) => {

    const innerContent = () => (
        <button
            className={cx(styles[type], styles[color], styles[size])}
            onClick={onClick || null}
        >
            {text &&
                <label className={styles.label}>{text}</label>
            }
            {icon === "chevron-down" &&
                <ChevronDown />
            }
            {icon === "close-x" && 
                <CloseX />
            }
            {icon === "arrow-up-circle" &&
                <ArrowUpCircle />
            }
            {icon === "right-arrow" &&
                <RightArrow />
            }
        </button>
    )
    return !!href ? (
        <Link to={href}>{innerContent()}</Link>
    ) : (
        innerContent()
    );
};

export default Button;
