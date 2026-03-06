import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OptionsTable } from './components/OptionsTable';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorPage } from './components/ErrorPage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <div className="App">
                <header className="App-header">
                  <OptionsTable/>
                </header>
              </div>
            } />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/403" element={<ErrorPage statusCode={403} />} />
            <Route path="/404" element={<ErrorPage statusCode={404} />} />
            <Route path="/500" element={<ErrorPage statusCode={500} />} />
            <Route path="*" element={<ErrorPage statusCode={404} />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
