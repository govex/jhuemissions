import Button from '../button/button';
import { Link } from 'react-router';
import { ReactComponent as ChevronDown } from '../icons/chevron-down';
import './topBar.css';

const TopBar = () => {
    return (
        <div className="topBar">
            {/* image */}
            <div className="logo">
                <img src="general/logoL.png" alt="Johns Hopkins University Bloomberg Center for Government Excellence" />
            </div>

            {/* buttons */}
            <div className="navs">
                <ul className="topList">
                    <li className="topListItem">
                        <Link className='link down-arrow' to="/about"> About <ChevronDown/></Link>
                    </li>
                    <li className="topListItem">
                        <Link className='link' to="/methodology"> Methodology <ChevronDown/></Link>
                    </li>
                    <li className="topListItem">
                        <Link className='link' to="#"> Contact <ChevronDown/></Link>
                    </li>
                    <li className="topListItem">
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
