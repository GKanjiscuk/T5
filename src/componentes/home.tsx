type Props = {
  tema: string;
};

export default function Home({ tema }: Props) {
  const azulPrincipal = "#003366";
  const azulEscuro = "#0056b3";
  const fundoClaro = "#f0f8ff";

  const cards = [
    {
      titulo: "Clientes",
      texto:
        "Gerencie os dados e o histórico dos seus clientes com facilidade.",
      imagem: "client.png",
      link: "/clientes",
    },
    {
      titulo: "Pets",
      texto:
        "Acompanhe todas as informações essenciais sobre os pets registrados.",
      imagem: "pets.png",
      link: "/pets",
    },
    {
      titulo: "Produtos",
      texto:
        "Organize e controle os produtos disponíveis no seu estabelecimento.",
      imagem: "product.png",
      link: "/produtos",
    },
    {
      titulo: "Servicos",
      texto:
        "Administre os serviços oferecidos e seu agendamento de forma eficiente.",
      imagem: "service.png",
      link: "/servicos",
    },
  ];

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: fundoClaro, minHeight: "82vh" }}
    >
      <div className="d-flex align-items-center justify-content-center gap-3 title pt-5">
        <h1 style={{ fontSize: "300%", color: azulPrincipal }}>PetLovers</h1>
      </div>

      <hr className="line" style={{ borderTop: `3px solid ${azulPrincipal}` }} />

      <h5 className="subtitle text-center text-secondary">
        Explore os blocos abaixo, para ter acesso aos serviços que temos a
        oferecer em nosso pet shop
      </h5>

      <div className="container pt-4">
        <div className="row justify-content-center">
          {cards.map((item, index) => (
            <div className="col-md-3 col-sm-12 mb-4" key={index}>
              <div
                className="card shadow border-0"
                style={{ backgroundColor: fundoClaro }}
              >
                <div className="card-body">
                  <h5
                    className="card-title text-center titleCard"
                    style={{ color: azulPrincipal }}
                  >
                    {item.titulo}
                  </h5>
                  <p className="card-text text-center subtitleCard text-secondary">
                    {item.texto}
                  </p>
                  <div className="text-center mb-3">
                    <img
                      src={item.imagem}
                      style={{ width: "70%" }}
                      className="d-block mx-auto"
                      alt={item.titulo}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <a
                      href={item.link}
                      className="btn text-white"
                      style={{
                        backgroundColor: azulPrincipal,
                        border: `1px solid ${azulEscuro}`,
                        borderRadius: "5px",
                        padding: "0.375rem 0.75rem",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = azulEscuro)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = azulPrincipal)
                      }
                    >
                      Acessar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
