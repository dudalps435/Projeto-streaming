import { Routes, Route } from 'react-router-dom'
import './App.css'
import PaginaInicio from './Pages/PaginaInicio'
import PaginaWatchlist from './Pages/PaginaWatchlist'
import PaginaDetalhes from './Pages/PaginaDetalhes'
import PaginaNotificacoes from './Pages/PaginaNotificacoes'
import PaginaMaisAssistidos from './Pages/PaginaMaisAssistidos'
import PaginaNaoEncontrada from './Pages/PaginaNaoEncontrada'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="/watchlist" element={<PaginaWatchlist />} />
      <Route path="/titulo/:id" element={<PaginaDetalhes />} />
      <Route path="/notificacoes" element={<PaginaNotificacoes />} />
      <Route path="/mais-assistidos" element={<PaginaMaisAssistidos />} />
      <Route path="*" element={<PaginaNaoEncontrada />} />
    </Routes>
  )
}

export default App
