import { Link } from "react-router-dom";
import React from "react";

type FooterProps = {
    tema: string,
    botoes: string[]
};

const Footer: React.FC<FooterProps> = ({ tema, botoes }) => {
    const linkMap: { [key: string]: string } = {
        Home: "/home",
        Clientes: "/clientes",
        Pets: "/pets",
        Produtos: "/produtos",
        Serviços: "/servicos"
    };

    const azulEscuro = "#0056b3";
    const azulClaro = "#007BFF"; 

    return (
        <footer className="text-center height" style={{ backgroundColor: tema, color: "white", minHeight: '10vh' }}>
            <div className="container py-4">
                <div className="mb-3 title d-flex justify-content-center flex-wrap gap-3">
                    {botoes.map((botao, index) => (
                        <Link
                            key={index}
                            to={linkMap[botao] || "#"}
                            style={{
                                color: "#ffffff",
                                textDecoration: "none",
                                fontWeight: "500"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = azulEscuro}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#ffffff"}
                        >
                            {botao}
                        </Link>
                    ))}
                </div>
                <hr className="line" style={{ borderTop: "2px solid white", width: "60%", margin: "auto" }} />
            </div>
        </footer>
    );
}

export default Footer;