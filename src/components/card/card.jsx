import "./card.css"
function Card({text1, text2, text3,text3Color}) {
    return (
        <div className="card">
            <div className="text1"> {text1 || 'Total emissions'}</div>
            <div className="text2">{text2 || 'XX,XXX'}</div>
            <div className="text3" style={{ color: text3Color || '#6AA0A8' }}>{text3 || '% change from last month'}</div>
        </div>
    )
}

export default Card