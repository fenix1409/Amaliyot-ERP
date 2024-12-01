import { Route, Routes } from 'react-router-dom'
import { usePath } from '../hook/usePath'
import { SignIn } from '../pages/Login/SignIn'
import Dashboard from '../pages/Dashboard/Dashboard'

const LoginRoutes = () => {
  return (
    <Routes>
        <Route path={usePath.signIn} element={<SignIn/>}/>
        <Route path={'/dashboard'} element={<Dashboard/>}/>
    </Routes>
  )
}

export default LoginRoutes