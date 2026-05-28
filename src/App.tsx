import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 text-2xl font-bold">L'Arche — en construction</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
