function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Odonto Wudich</h1>
      <p>Dashboard inicial da clínica odontológica.</p>

      <section style={{ marginTop: "2rem" }}>
        <h2>O que você poderá fazer aqui</h2>
        <ul>
          <li>Fazer login com usuário da clínica (dentista ou secretária);</li>
          <li>Gerenciar pacientes;</li>
          <li>Agendar e acompanhar consultas;</li>
          <li>Integrar todas as telas com a API em Django REST Framework.</li>
        </ul>
      </section>
    </main>
  );
}

export default HomePage;