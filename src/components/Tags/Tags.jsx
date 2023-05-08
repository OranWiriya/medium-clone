import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Tags(props) {
  const [tags, setTags] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8000/articles/getAll")
      .then(res => {
        setTags(res.data.article[0])
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleTagClick = (tag) => {
    props.handleTagClick(tag);
  };

  const tagCounts = tags.reduce((counts, tag) => {
    if (tag.Tags && tag.Tags[0].name) {
      tag.Tags.forEach(tag => {
        counts[tag.name] = (counts[tag.name] || 0) + 1;
      });
    }
    return counts;
  }, {});
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0,20);

  return (
    <div className="tag-container">
      <div className='tagHeader'>
        Tag trends
      </div>
      <ul className="flex flex-wrap gap-1">
        {sortedTags.map(tag => (
          <li className={tag} key={tag} onClick={() => handleTagClick(tag)}>{tag}</li>
        ))}
      </ul>
    </div>
  )
}

export default Tags