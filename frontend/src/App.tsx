import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Connect from './screens/connect'
import Home from './screens/Home'
import { ThemeProvider } from './utils/ThemeProvider'


function App() {

  return (
    <>
    <ThemeProvider
        defaultTheme="light"
        storageKey="vite-ui-theme"
        >
        <BrowserRouter>
           <Routes>
              <Route path='/'  element={<Home /> } />
              <Route path='/connect'  element={<Connect/> } />
            </Routes>
        </BrowserRouter>     
    </ThemeProvider>
    </>  
  )
}

export default App
