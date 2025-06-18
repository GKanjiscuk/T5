import React from "react"; // Import React
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

interface BarraNavegacaoProps {
  tema: string;
  botoes: string[];
  seletorView: (view: string) => void;
}

const BarraNavegacao: React.FC<BarraNavegacaoProps> = ({ tema, botoes, seletorView }) => {
  const renderNavButtons = () => {
    const outrosBotoes = botoes.filter((valor) => valor !== "Home");

    if (outrosBotoes.length === 0) {
      return null;
    }

    return outrosBotoes.map((valor) => (
      <li key={valor} className="nav-item">
        <button
          className="nav-link text-white"
          onClick={() => seletorView(valor)}
          style={{ textTransform: "capitalize" }}
        >
          {valor}
        </button>
      </li>
    ));
  };

  return (
    <>
      <style>{`
        .navbar-collapse.collapsing .navbar-nav,
        .navbar-collapse.show .navbar-nav {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin: 0 auto;
          padding-left: 0;
        }

        .navbar-collapse.collapsing .navbar-nav .nav-item,
        .navbar-collapse.show .navbar-nav .nav-item {
          width: 100%;
          text-align: center;
          margin: 5px 0;
        }


        .navbar-collapse.collapsing .navbar-nav .nav-item .nav-link,
        .navbar-collapse.show .navbar-nav .nav-item .nav-link {
          font-weight: bold !important;
          padding: 10px 0;
          display: block;
          width: 100%;
        }


        @media (max-width: 991.98px) {
          .navbar-collapse {
              width: 100%;
          }
          .navbar-nav.ms-auto {
              margin-left: unset !important;
              margin-right: unset !important;
          }
          .navbar > .container-fluid {
              display: flex;
              justify-content: space-between;
              align-items: center;
          }
        }
      `}</style>

      <nav
        className="navbar navbar-expand-lg"
        data-bs-theme="dark"
        style={{ backgroundColor: tema, minHeight: "8vh" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <button
            className="navbar-brand text-white d-flex align-items-center"
            onClick={() => seletorView("Home")}
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            <span className="title" style={{ fontSize: "30px" }}>
              PetLovers
            </span>
          </button>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto">
              {renderNavButtons()}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BarraNavegacao;