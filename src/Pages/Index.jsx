import React, { useState } from 'react'
import Banner from '../components/Banner/Banner'
import Article from '../components/Articles/Article'
import Tags from '../components/Tags/Tags'



function Index() {
    const [tag, setTag] = useState("")

    const handleTagClick = (tag) => {
        setTag(tag);
    };

    return (
        <>
            <Banner />
            <div className="container">
                <div className="sub-container">
                    <Article tag={tag} />
                    <Tags handleTagClick={handleTagClick}/>
                </div>
            </div>
        </>
    )
}

export default Index