import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import localStorage from '../../services/localStorage'
import jwtDecode from 'jwt-decode'
import Markdown from "markdown-to-jsx";

function OneArticle() {
    const [article, setArticle] = useState({ User: {} })
    const [favorite, setFavorite] = useState("")
    const [follow, setFollow] = useState("")
    const [me, setMe] = useState([])
    const [articleFav, setArticleFav] = useState(0)
    const [comment, setComment] = useState("")
    const [showComment, setShowComment] = useState([])
    const [userFollow, setUserFollow] = useState(0)
    const { articleId } = useParams()
    const navigate = useNavigate();
    const isMe = (article.user_id === me.id);
    const favoriteCount = Array.isArray(favorite) ? favorite.filter((fav) => fav.article_id === article.id).length : 0;
    const isFavorite = Array.isArray(favorite) ? favorite.find((fav) => fav.article_id === article.id && fav.user_id === me.id) : null;
    const followCount = Array.isArray(follow) ? follow.filter(follow => follow.user_id === article.user_id).length : 0;
    const isFollowing = Array.isArray(follow) ? follow.find(follow => follow.follower_id === me.id) : null;
    const date = new Date(article.createdAt);
    const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    useEffect(() => {
        axios.get(`/articles/${articleId}`)
            .then((res) => {
                setArticleFav(0)
                setUserFollow(0)
                setArticle(res.data.article[0]);
                setFavorite(res.data.article[1]);
                setFollow(res.data.follower);
                const role = localStorage.getRole();
                if (role === "user") {
                    const payload = localStorage.getToken();
                    const data = jwtDecode(payload);
                    setMe(data)
                }
            })
    }, [articleFav || userFollow])
    useEffect(() => {
        axios.get(`comments/${articleId}`)
            .then(res => {
                setShowComment(res.data.comment);
            })
            .catch(err=> {
                console.log(err)
            })
    }, [])

    const handleComment = (e) => {
        const body = {
            content: comment
        }
        setComment("")
        axios.post(`comments/${articleId}`, body)
            .then(res => {
                console.log(res)
            })
            .catch(err=> {
                console.log(err)
            })
    }

    const handleFavorite = (articleId) => {
        axios.post(`articles/${articleId}`)
            .then(res => {
                setArticleFav(1)
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleFollowing = (userId) => {
        axios.post(`/users/follow/${userId}`)
            .then(res => {
                setUserFollow(1)
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleDelete = (articleId) => {
        axios.delete(`/articles/${articleId}`)
            .then(res => {
                navigate("/");
                window.location.reload();
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleEdit = (articleId) => {
        navigate(`/article/editarticle/${articleId}`)
    }

    const handleDeletecomment = (commentId) => {
        axios.delete(`/comments/${articleId}/${commentId}`)
            .then(res => {
                window.location.reload()
                console.log(res)
            })
    }
    return (
        <>
            <div>
                <div className='HeaderTitle'>
                    {article.title}
                    <div className='Author'>
                        <img src={article.User.image} alt="logo" width={40} height={40} className="imageProfile" />
                        <div className='inline-block'>
                            <div className="username inline-block mr-10">
                                <Link to={`/profile/${article.User.id}`}>
                                    {article.User.username}
                                </Link>
                                <div className="timeCreate">{formattedDate}</div>
                            </div>
                        </div>
                        {isMe ? (
                            <>
                                <button type='button'
                                    onClick={() => handleDelete(article.id)}
                                    className='border border-[#FF0A49] rounded-md px-2 py-1 -translate-y-2 bg-[#FF0A49] text-sm text-white hover:bg-[#9b052b] hover:border-[#9b052b]'>
                                    <ion-icon name="trash" /> delete Article
                                </button>
                                <button type='button'
                                    onClick={() => handleEdit(article.id)}
                                    className='border border-[#FFC017] rounded-md ml-1 px-2 py-1 -translate-y-2 bg-[#FFC017] text-sm text-white hover:bg-yellow-600 hover:border-yellow-600'>
                                    <ion-icon name="pencil" /> edit Article
                                </button>
                            </>
                        ) : (
                            <>
                                {isFavorite ? (
                                    <button type='button'
                                        onClick={() => handleFavorite(article.id)}
                                        className='border border-[#FFC017] rounded-md px-2 py-1 -translate-y-2 bg-[#FFC017] text-sm text-white hover:bg-yellow-600 hover:border-yellow-600'>
                                        <ion-icon name="heart" /> favorited {favoriteCount}
                                    </button>
                                ) : (
                                    <button type='button'
                                        onClick={() => handleFavorite(article.id)}
                                        className='border border-[#FFC017] rounded-md px-2 py-1 -translate-y-2 text-[#FFC017] text-sm hover:text-yellow-600 hover:border-yellow-600'>
                                        <ion-icon name="heart" /> favorite {favoriteCount}
                                    </button>
                                )}
                                {isFollowing ? (
                                    <button type='button'
                                        onClick={() => handleFollowing(article.user_id)}
                                        className='border border-[#305EFF] rounded-md ml-1 px-2 py-1 -translate-y-2 bg-[#305EFF] text-sm text-white hover:bg-blue-600 hover:border-blue-600'>
                                        following {JSON.stringify(followCount)}
                                    </button>
                                ) : (
                                    <button type='button'
                                        onClick={() => handleFollowing(article.user_id)}
                                        className='border border-[#305EFF] rounded-md ml-1 px-2 py-1 -translate-y-2 text-[#305EFF] text-sm hover:text-blue-600 hover:border-blue-600'>
                                        follow {JSON.stringify(followCount)}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className='ContentArticle'>
                    <div className='subContent prose lg:prose-xl' >
                        {article.content && <Markdown options={{ forceBlock: true }}>{article.content || ""}</Markdown>}
                    </div>
                    <ul className='tag-list-one'>
                        {article.Tags && article.Tags[0].name && article.Tags.length > 0 ? (article.Tags.map(tag => {
                            return <li key={tag.id}>{tag.name}</li>
                        })) : (
                            null
                        )}
                    </ul>
                </div>
                <div className='Comment-container'>
                    <form className='Comment-row' onSubmit={handleComment}>
                        <div className='Comment-textarea'>
                            <textarea name="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder='comment here ( please be kind ):D' rows="6" />
                        </div>
                        <div className='Comment-user'>
                            <img src={me.image} alt="logo" width={40} height={40} className="imageProfile" />
                            <div className='name'>
                                {me.username}
                            </div>
                            <button type='submit' className='btn-comment'>
                                comment
                            </button>
                        </div>
                    </form>
                    {showComment && showComment.length > 0 && (
                        showComment.sort((a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt))
                            .map(comment => {
                                const date = new Date(comment.createdAt);
                                const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                                return (
                                    <div key={comment.id} className='comment-list'>
                                        <div className='commnet-content'>
                                            {comment.content}
                                        </div>
                                        <div className='Comment-user'>
                                            <img src={comment.User.image} alt="logo" width={30} height={30} className="imageProfile " />
                                            <div className='group-name-time'>
                                                <div className='name'>
                                                    <Link to={`/profile/${comment.User.id}`}>
                                                        {comment.User.username}
                                                    </Link>
                                                </div>
                                                <div className='time-comment'>
                                                    {formattedDate}
                                                </div>
                                            </div>
                                            {comment.user_id === me.id ? (
                                                <div className='icon-delete-comment' onClick={() => handleDeletecomment(comment.id)}>
                                                    <ion-icon name="trash" />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                )
                            })
                    )}
                </div>
            </div>
        </>
    )
}

export default OneArticle