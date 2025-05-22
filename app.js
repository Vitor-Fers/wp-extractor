const { useState, useEffect } = React;

const App = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pages');
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState({ pages: 1, users: 1, media: 1 });
  const [theme, setTheme] = useState(localStorage.getItem('wpExplorerTheme') || 'light');

  useEffect(() => {
    const savedHistory = localStorage.getItem('wpExplorerHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (url && data) {
      const newHistory = [url, ...history.filter(h => h !== url)].slice(0, 3);
      setHistory(newHistory);
      localStorage.setItem('wpExplorerHistory', JSON.stringify(newHistory));
    }
  }, [url, data]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('wpExplorerTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchAllData = async (url) => {
    setIsLoading(true);
    setError('');
    try {
      const fetchAllPages = async (endpoint) => {
        let allItems = [];
        let page = 1;
        let totalPages = 1;
        console.log(allItems)

        while (page <= totalPages) {
          const response = await fetch(`${url}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}`);
          if (!response.ok) {
            throw new Error(`Erro ao buscar ${endpoint}`);
          }
          const items = await response.json();
          if (items.code) {
            throw new Error(`Erro na API: ${items.message}`);
          }
          allItems = [...allItems, ...items];
          totalPages = parseInt(response.headers.get('X-WP-TotalPages') || 1);
          page++;
        }
        return allItems;
      };

      const [pages, users, media] = await Promise.all([
        fetchAllPages('pages'),
        fetchAllPages('users'),
        fetchAllPages('media'),
      ]);

      setData({ pages, users, media });
      setPage({ pages: 1, users: 1, media: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      fetchAllData(url);
    }
  };

  const filteredPages = data?.pages?.filter(p =>
    p.title.rendered.toLowerCase().includes(search.toLowerCase())
  ) || [];
  const filteredUsers = data?.users?.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  ) || [];
  const filteredMedia = data?.media?.filter(m =>
    m.media_type === 'image' &&
    m.title.rendered.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const itemsPerPage = 100;

  const getPaginatedItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (tab, direction) => {
    setPage(prev => ({
      ...prev,
      [tab]: direction === 'next' ? prev[tab] + 1 : prev[tab] - 1
    }));
  };

  const renderPagination = (tab, items) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const currentPage = page[tab];

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(tab, 'prev')}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(tab, 'next')}
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Simple WordPress Explorer</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Insira a URL do site WordPress (ex.: https://demo.wp-api.org/)"
        />
        <button type="submit">Analisar</button>
      </form>

      {history.length > 0 && (
        <div className="history">
          Histórico: {history.map(item => (
            <span
              key={item}
              onClick={() => { setUrl(item); fetchAllData(item); }}
            >
              {item.replace(/^https?:\/\//, '')}
            </span>
          ))}
        </div>
      )}

      {isLoading && <div className="loading">Carregando todos os dados, por favor aguarde...</div>}

      {error && <div className="error">{error}</div>}

      {data && !isLoading && !error && (
        <div>
          <div className="tabs">
            <div
              className={`tab ${activeTab === 'pages' ? 'active' : ''}`}
              onClick={() => setActiveTab('pages')}
            >
              Páginas ({filteredPages.length})
            </div>
            <div
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Usuários ({filteredUsers.length})
            </div>
            <div
              className={`tab ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              Mídias ({filteredMedia.length})
            </div>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar ${activeTab === 'pages' ? 'páginas' : activeTab === 'users' ? 'usuários' : 'imagens'}...`}
          />

          {activeTab === 'pages' && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan="3">{search ? 'Nenhuma página encontrada' : 'Nenhuma página disponível'}</td>
                    </tr>
                  ) : (
                    getPaginatedItems(filteredPages, page.pages).map(page => (
                      <tr key={page.id}>
                        <td>{page.id}</td>
                        <td dangerouslySetInnerHTML={{ __html: page.title.rendered }}></td>
                        <td>
                          <a href={page.link} target="_blank" rel="noopener noreferrer">Visitar</a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filteredPages.length > 0 && renderPagination('pages', filteredPages)}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="3">{search ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}</td>
                    </tr>
                  ) : (
                    getPaginatedItems(filteredUsers, page.users).map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>
                          <a href={user.link} target="_blank" rel="noopener noreferrer">Visitar</a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filteredUsers.length > 0 && renderPagination('users', filteredUsers)}
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <div className="media-grid">
                {filteredMedia.length === 0 ? (
                  <div>{search ? 'Nenhuma imagem encontrada' : 'Nenhuma imagem disponível'}</div>
                ) : (
                  getPaginatedItems(filteredMedia, page.media).map(media => (
                    <div key={media.id} className="media-item">
                      <img
                        src={media.source_url}
                        alt={media.title.rendered}
                      />
                      <p dangerouslySetInnerHTML={{ __html: media.title.rendered }}></p>
                      <a href={media.source_url} download>Download</a>
                    </div>
                  ))
                )}
              </div>
              {filteredMedia.length > 0 && renderPagination('media', filteredMedia)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));