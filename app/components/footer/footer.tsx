import styles from './footer.module.scss';
import Button from 'app/components/button/button';
import { Link } from 'react-router';
import { ReactComponent as ArrowUpCircle } from '../icons/arrow-up-circle';

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.wave}></div>
            <div className={styles.attribution}>
                <p>
                This Campus as Living Lab project was led by <a href="https://publichealth.jhu.edu/faculty/2220/rose-weeks">Rose Weeks</a>, with oversight from <a href='https://publichealth.jhu.edu/faculty/4291/daniel-ali'>Daniel Ali</a>, <a href='https://publichealth.jhu.edu/faculty/4022/laura-k-beres'>Laura Beres</a>, and <a href='https://publichealth.jhu.edu/faculty/2847/ryan-david-kennedy'>Ryan Kennedy</a>. The dashboard was designed by the Bloomberg Center for Government Excellence team, including <a href='https://govex.jhu.edu/about/our-team/'>Sara Bertran De Lis, Mary Conway Vaughan, Heather Bree, Iris Shin, and K'lila Nooning</a>, with help from Teerth Satwara. Data insights are by JHU Travel Program Manager Amy Page, with <a href='https://sustainability.jhu.edu/who-we-are/office-of-sustainability/'>Krittika Negandhi and Agathe Pierot</a> at the Johns Hopkins Office of Climate and Sustainability.
                </p>
            </div>
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
                            color='secondary'
                            href="http://govex.jhu.edu"
                            type='border'
                            size='small'
                        />
                    </li>
                </ul>
            </div>

            {/* Bottom Section */}
            <div className={styles.footBottom}>
                <span><Link to={"https://it.johnshopkins.edu/policies-privacystatement/"}>Privacy Policy</Link> | Copyright 2025</span>
                <span><div className={styles.scrollTo} onClick={()=>window.scrollTo({top:0, left:0, behavior: "smooth"})}><ArrowUpCircle/></div></span>
            </div>
        </div>
    );
};

export default Footer;
