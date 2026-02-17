import { BrowserRouter, Routes ,Route} from "react-router-dom"
import Home from "./pages/Home"

import Navbar from "./components/Navbar"
import Register from "./pages/Register"
import CreateEvent from "./pages/CreateEvent"
import LoginPage from "./pages/LoginPage"
import Profile from "./pages/Profile"

import AllOrganizers from "./pages/AllOrganizers"
import FollowedAccounts from "./pages/FollowedAccounts"
import FollowersPage from "./pages/FollowersPage"
import UserPosts from "./pages/org_events/UserPosts"
import Footer from "./components/Footer"
// import useProfileStore from "./stores/store"

function App() {
// const profileStore = useProfileStore();
// console.log(profileStore);

  return (
    <>

    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home/>}/>
     <Route path='/register' element={<Register/>} /> 
      <Route path='/login' element={<LoginPage/>}/>
     <Route path='/create-event' element={<CreateEvent/>} />
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/organizers' element={<AllOrganizers/>}/>
    <Route path="/following" element={<FollowedAccounts/>} />
    <Route path='/followers' element={<FollowersPage/>} />
    <Route path="/my-events" element={<UserPosts/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
