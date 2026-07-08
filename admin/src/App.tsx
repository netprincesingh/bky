import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import LoginScreen from './screens/login/LoginScreen';
import MainLayout from './components/layout/MainLayout';
import './App.css';

// Screens
import DashboardScreen from './screens/home/DashboardScreen';
import AuthorListScreen from './screens/authors/AuthorListScreen';
import BookListScreen from './screens/books/BookListScreen';
import ArticleListScreen from './screens/articles/ArticleListScreen';
import NodeListScreen from './screens/nodes/NodeListScreen';
import ChunkListScreen from './screens/chunks/ChunkListScreen';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginScreen />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardScreen />} />
          <Route path="authors" element={<AuthorListScreen />} />
          <Route path="books" element={<BookListScreen />} />
          <Route path="nodes" element={<NodeListScreen />} />
          <Route path="articles" element={<ArticleListScreen />} />
          <Route path="chunks" element={<ChunkListScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
