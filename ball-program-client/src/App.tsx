import PlaylistPage from './pages/PlaylistPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PlaylistsListPage from './pages/PlaylistsListPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlaylistsListPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
