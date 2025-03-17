import { Link } from 'react-router'
import './topBar.css'

const TopBar = () => {
    return (
        <div className="topBar">
            {/* image */}
            <div className="logo">
                <img src="general/logoL.png" alt="" />
            </div>

            {/* buttons */}
            <div className="navs">
                <ul className="topList">
                    <li className="topListItem">
                        <Link className='link down-arrow' to="/about"> About </Link>
                    </li>
                    <li className="topListItem">
                        <Link className='link' to="/methodology"> Methodology </Link>
                    </li>
                    <li className="topListItem govEx">GovEx</li>
                    
                    
                </ul>


            </div>

        </div>
    )
}

export default TopBar
