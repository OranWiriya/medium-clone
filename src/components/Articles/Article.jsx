import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import localStorage from '../../services/localStorage'
import jwtDecode from 'jwt-decode'
import ReactPaginate from "react-paginate";


function Article(props) {
    const [article, setArticle] = useState([])
    const [favorite, setFavorite] = useState("")
    const [me, setMe] = useState(0)
    const [articleFav, setArticleFav] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [global, setGlobal] = useState("")
    const [follow, setFollow] = useState([])

    const articlesPerPage = 3;
    const sortedArticles = global === "following" && follow && follow.length > 0 ? (
        article.filter(article => {
            return follow.some(follow => follow.id === article.user_id)
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ) : (global !== "" ? article.filter(article =>
        article.Tags.some(tag =>
            tag.name === global)).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt))
        : article.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)));
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticle = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const pageNumbers = Math.ceil(sortedArticles.length / articlesPerPage);

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
            .catch(err => console.log(err))
    }, [articleFav])

    useEffect(() => {
        handleGlobalfeed(props.tag);
    }, [props.tag])

    useEffect(() => {
        axios.get(`users/following`)
            .then(res => {
                setFollow(res.data.following)
            })
    }, [])
    const handleGlobalfeed = (feed) => {
        setGlobal(feed);
        setCurrentPage(1);
    }

    const changePage = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

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

    return (
        <>
            <div className='textbox'>
                <ul className="header-feed">
                    <li className={global === "" ? ("active") : null} >
                        <button onClick={() => handleGlobalfeed("")}>
                            Global Feed
                        </button>
                    </li>
                    <li className={global === "following" ? ("ml-3 active") : "ml-3"} >
                        <button onClick={() => handleGlobalfeed("following")}>
                            Following Feed
                        </button>
                    </li>
                    {global && global !== "following" ? (
                        <>
                            <li className='ml-3 active'>
                                <button onClick={() => handleGlobalfeed(global)} className={global === "tag" ? ("active") : null} >{global}</button>
                            </li>
                        </>
                    ) : (
                        null
                    )}
                </ul>
                <div className="box">
                    {currentArticle.length > 0 ?
                        (currentArticle
                            .map((article) => {
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
                                                {article.Tags[0].name && article.Tags.length > 0 ? (article.Tags.map(tag => {
                                                    return <li key={tag.id} onClick={() => handleGlobalfeed(tag.name)}>{tag.name}</li>
                                                })) : (
                                                    null
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })) : (
                            <div className='mb-[17rem]'>
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

export default Article