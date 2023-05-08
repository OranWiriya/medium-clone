import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import Signin from "./Pages/signin"
import Index from './Pages/Index'
import Signup from './Pages/signup'
import Settings from './Pages/settings'
import Profile from './Pages/profile'
import NewArticle from './Pages/newarticle'
import Article from './Pages/article'
import EditArticle from './Pages/editarticle'
import { useState } from 'react'
import localStorage from './services/localStorage'

function Privateroutes() {
  const [role, setRole] = useState(localStorage.getRole());
  return role === "user" ? <Outlet /> : <Navigate to="/signin" />
}


export default function App() {

  return (
    <>
      <header className='sticky top-0 z-10'>
        <Navbar />
      </header>
      <Routes>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route element={<Privateroutes />}>
          <Route path='/' element={<Index />} />
          <Route path='/profile/:userId/settings' element={<Settings />} />
          <Route path='/profile/:userId' element={<Profile />} />
          <Route path='/new-article' element={<NewArticle />} />
          <Route path='/article/:articleId' element={<Article />} />
          <Route path='/article/editarticle/:articleId' element={<EditArticle />} />
        </Route>
      </Routes>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

