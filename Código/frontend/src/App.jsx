import React from 'react';
import AlunosPage from './pages/AlunosPage';
import EnviarMoedasForm from './components/EnviarMoedasForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <AlunosPage />
      <hr />
      <EnviarMoedasForm />
    </div>
  );
}

export default App;