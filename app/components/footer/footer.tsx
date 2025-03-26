import styles from './footer.module.scss';
import Button from 'app/components/button/button';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.wave}></div>
            {/* Top Section */}
            <div className={styles.footTop}>
                <img src="general/logoD.png" alt="Logo" className={styles.footImage} />
                <ul className={styles.footList}>
                    <li className={styles.footListItem}>
                        <Link to="/about"> About</Link>
                    </li>
                    <li className={styles.footListItem}>
                        <Link to="https://form.asana.com/?k=4W32Fdf5p7zPNIV-3gKh5A&d=1108016200678557"> Contact </Link>
                    </li>
                    <li className={styles.footListItem}>
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

            {/* Bottom Section */}
            <div className={styles.footBottom}>
                <span>Privacy Policy | Copyright 2024</span>
            </div>
        </div>
    );
};

export default Footer;
