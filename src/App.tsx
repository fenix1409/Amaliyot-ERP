import { useContext } from 'react'
import './App.css'
import { Context } from './context/Context'
import { SignIn } from './pages/Login/SignIn'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  const {token} = useContext(Context)
  if(!token){
    return <SignIn/>
  }
  else{
    return <Dashboard/>
  }
}

export default App


// npx json-server db.json --port 3001 for execute the db.json