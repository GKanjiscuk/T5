import { Routes, Route, useNavigate } from "react-router-dom";
import BarraNavegacao from "./barraNavegacao";
import Home from "./home";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import Footer from "./footer";
import Clientes from "./clientes";
import Pets from "./pets";
import Produtos from "./produtos";
import Servicos from "./servicos"


export default function Roteador() {
    const navigate = useNavigate();

    function selecionarView(view: string) {
        navigate(`/${view.toLowerCase()}`);
    }

    const botoes = ['Home', 'Clientes', 'Pets', 'Produtos', 'Servicos',];

    return (
        <>
            <BarraNavegacao seletorView={selecionarView} tema="#0056b3" botoes={botoes} />
            <Routes>
                <Route path="/" element={<Home tema="#0056b3" />} />
                <Route path="/home" element={<Home tema="#0056b3" />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/pets" element={<Pets/>}/>
                <Route path="/produtos" element={<Produtos/>}/>
                <Route path="/servicos" element={<Servicos/>}/>
            </Routes>

            <Footer botoes={botoes} tema="rgb(0, 4, 255)"/>
        </>
    );
}
