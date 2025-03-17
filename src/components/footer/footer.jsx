import './footer.css';

const Footer = () => {
    return (
        <div className="footer">
            {/* Top Section */}
            <div className="foot-top">
                <img src="general/logoD.png" alt="Logo" className="foot-image" />
                <ul className="foot-list">
                    <li className="foot-list-item">What We Do</li>
                    <li className="foot-list-item">About us</li>
                    <li className="foot-list-item">News & Media</li>
                    <li className="foot-list-item">Careers</li>
                    <li className="foot-list-item">Contact</li>
                </ul>
            </div>

            {/* Bottom Section */}
            <div className="foot-bottom">
                <span>Privacy Policy | Copyright 2024</span>
                <div className="up-arrow">
                    
                </div>
            </div>
        </div>
    );
};

export default Footer;
