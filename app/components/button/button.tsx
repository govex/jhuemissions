import { Link } from 'react-router'
import { ReactComponent as RightArrow } from "~/components/icons/right-arrow";
import { ReactComponent as ChevronDown } from "~/components/icons/chevron-down";
import { ReactComponent as ArrowUpCircle } from "~/components/icons/arrow-up-circle";
import { ReactComponent as CloseX } from "~/components/icons/close-x";
import cx from "classnames";
import styles from "./button.module.scss"

const Button = ({ 
    type="solid", 
    icon=undefined, 
    text=undefined, 
    color="primary", 
    size="small", 
    onClick=null,
    href=undefined,
    disabled=false
}) => {

    const innerContent = () => (
        <button
            className={cx(styles.base, styles[type], styles[color], styles[size], disabled ? styles.disabled : "")}
            onClick={onClick || undefined}
            disabled={disabled}
        >
            {text &&
                <label className={cx(styles.label, icon ? styles.icon : "")}>{text}</label>
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
