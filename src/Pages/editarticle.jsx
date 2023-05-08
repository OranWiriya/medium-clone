import axios from 'axios'
import React, {  useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function EditArticle() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tag, setTag] = useState("")
    const [error, setError] = useState("")
    const { articleId } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/articles/${articleId}`)
        .then(res => {
            setTitle(res.data.article[0].title);
            setContent(res.data.article[0].content);
            const tags = res.data.article[0].Tags;
            if (tags.length > 0) {
                const tagNames = tags.map(tag => tag.name).join(',');
                setTag(tagNames);
              }
            console.log(tags)
            console.log(res);
        })
        .catch(err => {
            console.log(err);
            navigate(`/article/${articleId}`);
        })
    },[])

    const onFinish = async (e) => {
        e.preventDefault()
        const body = {
            title: title,
            content: content,
            tags: tag
        }
        console.log(body)
        await axios.put(`http://localhost:8000/articles/${articleId}`, body)
            .then(result => {
                console.log(result);
                navigate(`/article/${articleId}`)
                window.location.reload();
            })
            .catch(err => {
                console.log(err)
                setError("Title should don't have space. ");
            })
    };

    return (
        <>
            <div className="form">
                <div className='text-center pt-5 text-red-500 font-semibold'>{error}</div>
                <form onSubmit={onFinish} className='flex mt-8 space-y-6 justify-center '>
                    <div className="-space-y-px rounded-md shadow-sm w-full mx-52 ">
                        <div>
                            <label >
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} name='title' placeholder='Article Title' required className='relative block w-full rounded-md border-0 py-5 text-3xl text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2.5 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 ' />
                            </label>
                        </div>
                        <br />
                        <div>
                            <label >
                                <textarea name='content' value={content} onChange={(e) => setContent(e.target.value)} placeholder='Write your article (in markdown)' required rows={8} className='relative block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2.5 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600  resize-y'>

                                </textarea>
                            </label>
                        </div>
                        <br />
                        <div>
                            <label >
                                <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} name='tag' placeholder='Enter tags' className='relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 px-2.5 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-yellow-600 ' />
                            </label>
                        </div>
                        <br />
                        <div >
                            <button
                                type="submit"
                                className="relative flex w-[180px] float-right justify-center rounded-md bg-yellow-600 mb-48 px-3 py-2 text-lg font-semibold text-white hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditArticle