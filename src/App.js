import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/login/Login'
import Cadastrar from './components/login/Cadastrar';
import Home from './components/pages/Home'
import Estoque from './components/pages/Estoque'
import NovoProduto from './components/pages/NovoProduto';
import Alterar from './components/pages/Alterar';
import Pdv from './components/pages/Pdv';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/cadastrar' element={<Cadastrar/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/estoque' element={<Estoque/>} />
          <Route path='/novoproduto' element={<NovoProduto/>} />
          <Route path='/alterar' element={<Alterar/>} />
          <Route path='/pdv' element={<Pdv/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
