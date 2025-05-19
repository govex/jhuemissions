import Button from 'app/components/button/button';
import { Navigate, NavLink } from 'react-router';
import { useAuth } from '~/provider/useAuth';
import { ReactComponent as ChevronDown } from 'app/components/icons/chevron-down';
import styles from './topbar.module.scss';

const TopBar = () => {
    const auth = useAuth();
    return (
        <div className={styles.topBar}>
            {/* image */}
            <div className={styles.logo}>
                <img src="/general/logoL.png" alt="Johns Hopkins University Bloomberg Center for Government Excellence" />
            </div>

            {/* buttons */}
            <div className={styles.navs}>
                <ul className={styles.topList}>
                    <li className={styles.topListItem}>
                        <NavLink to="/">
                        {({ isActive }) => (
                            <span> About <ChevronDown className={isActive ? styles.activeNav : ""} /> </span>
                        )}
                        </NavLink>
                    </li>
                    <li className={styles.topListItem}>
                        <NavLink to="/methodology"> 
                        {({ isActive }) => (
                            <span> Methodology <ChevronDown className={isActive ? styles.activeNav : ""} /> </span>
                        )}
                        </NavLink>
                    </li>
                    <li className={styles.topListItem}>
                        <Button 
                            color='primary'
                            size='small'
                            type='solid'
                            text='Dashboard' 
                            onClick={() => auth.signinRedirect()}
                        />
                    </li>
                    <li className={styles.topListItem}>
                        <Button 
                            text="GovEx"
                            color='primary'
                            href="http://govex.jhu.edu"
                            type='solid'
                            size='small'
                        />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TopBar
