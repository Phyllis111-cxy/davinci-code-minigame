import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LangdonPage } from '@/pages/LangdonPage'
import { SophiePage } from '@/pages/SophiePage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<LangdonPage />} />
        <Route path="/langdon" element={<Navigate to="/" replace />} />
        <Route path="/sophie" element={<SophiePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
