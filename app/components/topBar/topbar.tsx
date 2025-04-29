import Button from 'app/components/button/button';
import { Link } from 'react-router';
import { ReactComponent as ChevronDown } from 'app/components/icons/chevron-down';
import styles from './topbar.module.scss';

const TopBar = () => {
    return (
        <div className={styles.topBar}>
            {/* image */}
            <div className={styles.logo}>
                <img src="general/logoL.png" alt="Johns Hopkins University Bloomberg Center for Government Excellence" />
            </div>

            {/* buttons */}
            <div className={styles.navs}>
                <ul className={styles.topList}>
                    <li className={styles.topListItem}>
                        <Link className={styles.link} to="/"> Dashboard <ChevronDown/></Link>
                    </li>
                    <li className={styles.topListItem}>
                        <Link className={styles.link} to="/about"> About <ChevronDown/></Link>
                    </li>
                    <li className={styles.topListItem}>
                        <Link className={styles.link} to="/methodology"> Methodology <ChevronDown/></Link>
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
