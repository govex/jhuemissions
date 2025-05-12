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
    disabled=false,
    arrowDirection=undefined
}:{
    type: "border" | "solid" | "feedback",
    icon?: "chevron-down" | "close-x" | "arrow-up-circle" | "right-arrow" | undefined,
    text?: string | undefined,
    color: "primary" | "secondary",
    size: "large" | "medium" | "small",
    onClick?: any | null,
    href?: string | undefined,
    disabled?: boolean,
    arrowDirection?: "right" | "left" | "up" | "down" | undefined
}) => {
    const arrowRotation = {
        "arrow-up-circle": {
            "right": "rotate(90deg)",
            "left": "rotate(-90deg)",
            "up": "rotate(0deg)",
            "down": "rotate(180deg)"    
        },
        "chevron-down": {
            "right": "rotate(-90deg)",
            "left": "rotate(90deg)",
            "up": "rotate(180deg)",
            "down": "rotate(0deg"
        }
    }
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
                <ChevronDown  style={{transform: arrowDirection ? arrowRotation[icon][arrowDirection] : ""}}/>
            }
            {icon === "close-x" && 
                <CloseX />
            }
            {icon === "arrow-up-circle" &&
                <ArrowUpCircle style={{transform: arrowDirection ? arrowRotation[icon][arrowDirection] : ""}}/>
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
