import './App.css'
import { Route, Routes } from 'react-router-dom'
import RequestTypePage from './request/RequestTypePage'

function App() {
   

  return (
    <>
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/req" element={<RequestTypePage />} />
    </Routes>
    
    </>
  )
}

export default App
