import React, { useEffect, useState } from 'react'
import localStorage from '../services/localStorage'
import jwtDecode from 'jwt-decode'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import ReactPaginate from 'react-paginate'



function Profile() {
    const [profile, setProfile] = useState([])
    const [article, setArticle] = useState([])
    const [favorite, setFavorite] = useState("")
    const [me, setMe] = useState(0)
    const [follow, setFollow] = useState("")
    const [userFollow, setUserFollow] = useState(0)
    const [articleFav, setArticleFav] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [global, setGlobal] = useState("")
    const [bio, setBio] = useState("")
    const { userId } = useParams();

    const articlesPerPage = 3;
    const sortedArticles = global === "FavoriteArticle" ? (
        article.filter(article => {
            return favorite.some(fav => fav.article_id === article.id && fav.user_id === Number(userId));
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ) : (global !== "" ? article.filter((article) => article.user_id === Number(userId)).filter(article =>
        article.Tags.some(tag =>
            tag.name === global)).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt))
        : article.filter((article) => article.user_id === Number(userId)).sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)))
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticle = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const pageNumbers = Math.ceil(sortedArticles.length / articlesPerPage);
    const isFollowing = Array.isArray(follow) ? follow.find(follow => follow.id === Number(userId)) : null;

    useEffect(() => {
        axios.get(`/users/getinfo/${userId}`)
            .then(res => {
                setProfile(res.data);
            })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8000/articles/getAll")
            .then((res) => {
                setArticleFav(0)
                const articleData = res.data.article[0];
                const favoriteData = res.data.article[1];
                setArticle(articleData);
                setFavorite(favoriteData);
                const role = localStorage.getRole()
                if (role === "user") {
                    const payload = localStorage.getToken();
                    const data = jwtDecode(payload);
                    setMe(data.id)
                }
            })
    }, [articleFav])

    useEffect(() => {
        axios.get(`users/getinfo/${userId}`)
            .then(res => {
                setBio(res.data.targetBio)
            })
    }, [])

    useEffect(() => {
        setUserFollow(0)
        axios.get(`/users/following`)
            .then(res => {
                setFollow(res.data.following)
            })
            .catch(err => {
                setFollow("")
            })
    }, [userFollow])

    const handleGlobalfeed = (feed) => {
        setGlobal(feed);
        setCurrentPage(1);
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

    const changePage = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    return (
        <>
            <div className='banner-profile'>
                <div>
                    <img src={profile.targetImage} alt="DefaultProile" width={90} height={90} className=' mx-3 mt-10 rounded-xl' />
                </div>
                <div className='w-full text-center mb-5 mt-5'>{profile.targetUsername}</div>
                <div className='w-full text-center mb-5 font-normal text-base'>
                    {bio ? bio.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br /></span>
                    }) : null}
                </div>
                {Number(profile.targetId) === Number(me) ? (
                    <Link to={`/profile/${profile.targetId}/settings`}>
                        <button className='border border-yellow-500 hover:border-yellow-700 hover:text-yellow-700 text-yellow-500 text-xs font-bold py-2 px-4 rounded mb-5 ml-96'>Edit Profile Settings</button>
                    </Link>
                ) : (
                    <>
                        {isFollowing ? (
                            <button
                                type='button'
                                onClick={() => handleFollowing(userId)}
                                className='border border-[#FFC017] bg-[#FFC017] text-white hover:border-yellow-600 hover:bg-yellow-600 text-xs font-bold py-2 px-4 rounded mb-5 ml-96'>
                                following
                            </button>
                        ) : (
                            <button
                                type='button'
                                onClick={() => handleFollowing(userId)}
                                className='border border-yellow-500 hover:border-yellow-700 hover:text-yellow-700 text-yellow-500 text-xs font-bold py-2 px-4 rounded mb-5 ml-96'>
                                follow
                            </button>
                        )}
                    </>
                )}
            </div>
            <div className='textbox grid grid-cols-5 mt-5'>
                <div className='header-feed col-span-4 col-start-2'>
                    <ul className="header-feed">
                        <li className={global === "" ? ("active") : null} >
                            <button onClick={() => handleGlobalfeed("")}>
                                My Article
                            </button>
                        </li>
                        {me === Number(userId) ? (
                            <li className={global === "FavoriteArticle" ? ("ml-3 active") : "ml-3"} >
                                <button onClick={() => handleGlobalfeed("FavoriteArticle")}>
                                    Favorite Article
                                </button>
                            </li>
                        ) : null}
                        {global && global !== "FavoriteArticle" ? (
                            <>
                                <li className='ml-3 active'>
                                    <button onClick={() => handleGlobalfeed(global)} className={global === "tag" ? ("active") : null} >{global}</button>
                                </li>
                            </>
                        ) : (
                            null
                        )}
                    </ul>
                </div>
                <div className="box col-span-3 col-start-2 ">
                    {currentArticle.length > 0 ? (
                        currentArticle.map((article) => {
                            const favoriteCount = favorite.filter((fav) => fav.article_id === article.id).length;
                            const isFavorite = favorite.find((fav) => fav.article_id === article.id && fav.user_id === me);
                            const content = article.content.replace(/#|-|\*|=/g, '')
                            const date = new Date(article.createdAt);
                            const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                            return (
                                <div key={article.id}>
                                    <div className="mb-3.5">
                                        <img src={article.User.image} alt="logo" width={40} height={40} className="imageProfile" />
                                        <div className="inline-block">
                                            <div className="username">
                                                <Link to={`/profile/${article.User.id}`}>
                                                    {article.User.username}
                                                </Link>
                                            </div>
                                            <div className="timeCreate">{formattedDate}</div>
                                        </div>
                                        <div className="float-right">
                                            {isFavorite ? (
                                                <button type='button'
                                                    onClick={() => handleFavorite(article.id)}
                                                    className='border border-[#FFC017] rounded-md px-2 py-1 bg-[#FFC017] text-white hover:bg-yellow-600 hover:border-yellow-600'>
                                                    <ion-icon name="heart" /> {favoriteCount}
                                                </button>
                                            ) : (
                                                <button type='button'
                                                    onClick={() => handleFavorite(article.id)}
                                                    className='border border-[#FFC017] rounded-md px-2 py-1 text-[#FFC017] hover:text-yellow-600 hover:border-yellow-600'>
                                                    <ion-icon name="heart" /> {favoriteCount}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Link to={`/article/${article.id}`} >
                                            <div className='articleTitle'>{article.title}</div>
                                            <div className='contentShow'>{content.substring(0, 50)}{content.length > 50 ? "..." : ""}</div>
                                        </Link>
                                        <Link to={`/article/${article.id}`} className='readmore'>Read more...</Link>
                                        <ul className='tag-list'>
                                            {article.Tags[0].name && article.Tags.length > 0 &&
                                                article.Tags.map(tag => {
                                                    return <li key={tag.id} className='tag' onClick={() => handleGlobalfeed(tag.name)}>{tag.name}</li>
                                                })}
                                        </ul>
                                    </div>
                                </div>
                            )
                        })) : (
                        <div>
                            Articles not available.
                        </div>
                    )}
                    <ReactPaginate
                        forcePage={currentPage - 1}
                        activeClassName="active"
                        breakClassName="page-item"
                        breakLabel="..."
                        breakLinkClassName="page-link"
                        containerClassName="pagination page-numbers"
                        nextClassName="page-item"
                        nextLabel={<ion-icon name="caret-forward" />}
                        nextLinkClassName="page-link"
                        onPageChange={changePage}
                        pageClassName="page-item"
                        pageCount={pageNumbers}
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLabel={<ion-icon name="caret-back" />}
                        previousLinkClassName="page-link"
                        disabledClassName="disabled"
                        renderOnZeroPageCount={null}
                        marginPagesDisplayed={2}
                    />
                </div>
            </div>
        </>
    )
}

export default Profile