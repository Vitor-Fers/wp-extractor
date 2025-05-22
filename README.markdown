# Simple WordPress Explorer

## Visão Geral

O **Simple WordPress Explorer** é uma aplicação web minimalista que permite explorar conteúdos de sites WordPress por meio de sua API REST. Com uma interface simples, a aplicação extrai e exibe páginas, usuários e mídias (imagens) de um site WordPress informado pelo usuário, oferecendo funcionalidades de busca e histórico de URLs recentes. Desenvolvida com **React.js** (via CDN), **JavaScript** puro e **CSS** puro, a aplicação é leve e não depende de ferramentas de build complexas ou dependências externas além do React, sendo ideal para execução direta no navegador ou com um servidor local simples.

Este projeto foi criado como uma versão simplificada de um sistema maior, focando em facilidade de uso e manutenção mínima. É perfeito para testes rápidos, aprendizado sobre APIs REST do WordPress, ou como base para projetos mais avançados.

## Funcionalidades

- **Entrada de URL**: Permite inserir a URL de um site WordPress (ex.: `https://demo.wp-api.org/`) para análise.
- **Extração de Dados**: Busca até 10 páginas, usuários e mídias (imagens) via API REST do WordPress (`/wp-json/wp/v2/`).
- **Abas de Navegação**:
  - **Páginas**: Exibe ID, título e link para cada página.
  - **Usuários**: Exibe ID, nome e link para o perfil de cada usuário.
  - **Mídias**: Exibe imagens com título e opção de download individual.
- **Busca**: Filtra resultados por título (páginas e mídias) ou nome (usuários) em tempo real.
- **Histórico**: Armazena até 3 URLs recentes no `localStorage`, permitindo revisitar URLs com um clique.
- **Design Simples**: Interface limpa com estilização básica em CSS puro, sem dependências de frameworks como Tailwind CSS.

## Estrutura do Projeto

O projeto consiste em três arquivos:

- **`index.html`**: Estrutura HTML que carrega React, ReactDOM e Babel via CDN, além de vincular o CSS e o JavaScript.
- **`app.js`**: Lógica da aplicação em JavaScript com React, gerenciando estado, chamadas à API e renderização.
- **`styles.css`**: Estilização pura em CSS para layout, formulário, abas, tabelas e galeria de mídias.

## Pré-requisitos

- Um navegador moderno (Chrome, Firefox, etc.).
- Acesso à internet para carregar React/Babel via CDN e fazer chamadas à API REST.
- (Opcional) **Node.js** para rodar um servidor local e evitar problemas de CORS.

## Como Configurar e Executar

1. **Clone ou Crie os Arquivos**:
   - Crie uma pasta chamada `wordpress-explorer`.
   - Salve os arquivos `index.html`, `app.js` e `styles.css` na pasta com o conteúdo fornecido.

2. **Executar a Aplicação**:
   - **Diretamente no Navegador**:
     - Abra o `index.html` no navegador (ex.: arraste para o Chrome ou use `file://`).
     - **Nota**: Chamadas à API podem falhar devido a restrições de CORS. Use a opção abaixo para melhores resultados.
   - **Com Servidor Local (Recomendado)**:
     - Instale o Node.js (versão LTS) de [nodejs.org](https://nodejs.org/) se ainda não tiver.
     - No terminal, navegue até a pasta `wordpress-explorer`:
       ```bash
       cd wordpress-explorer
       ```
     - Inicie um servidor local:
       ```bash
       npx serve
       ```
     - Abra o navegador em `http://localhost:3000` (ou a porta indicada).
     - **Alternativa**: Use a extensão **Live Server** no VS Code.

3. **Usar a Aplicação**:
   - Insira a URL de um site WordPress com API REST ativada (ex.: `https://demo.wp-api.org/`).
   - Clique em "Analisar" para carregar os dados.
   - Navegue pelas abas (Páginas, Usuários, Mídias), use o campo de busca para filtrar, ou clique em URLs do histórico para revisitar.

## Testando

- **URL de Teste**: Use `https://demo.wp-api.org/` (site de demonstração da API REST do WordPress).
- **Verificar API**: Acesse `https://example.com/wp-json/` no navegador para confirmar que a API REST está ativa.
- **Problemas Comuns**:
  - **CORS**: Se rodar localmente (`file://`), o navegador pode bloquear chamadas à API. Use um servidor local (`npx serve`) ou teste com um site WordPress local configurado para permitir CORS.
  - **API Desativada**: Se a API retornar erro, o site pode ter a API REST desativada. Tente outra URL.
  - **URL Inválida**: Certifique-se de que a URL termina com `/` (ex.: `https://example.com/`).

## Limitações

- **CORS**: Chamadas à API podem falhar devido a restrições de CORS, especialmente ao rodar sem servidor local.
- **Funcionalidades Reduzidas**: Não inclui paginação, download em massa de mídias, ou estilização avançada para manter a simplicidade.
- **Performance**: Usar React/Babel via CDN é mais lento que um projeto com build (ex.: Vite).
- **Estilização Básica**: O design é minimalista, sem animações ou responsividade avançada.
- **Limite de Dados**: Busca apenas 10 itens por categoria (páginas, usuários, mídias).

## Possíveis Melhorias

- Adicionar paginação para carregar mais dados.
- Implementar download em massa de mídias em ZIP (requer bibliotecas como `jszip`).
- Melhorar a estilização com animações ou design responsivo.
- Configurar um projeto com Vite/Node.js para melhor performance e suporte a CORS.
- Adicionar modais para visualização de imagens ou notificações visuais.

## Contribuições

Sinta-se à vontade para sugerir melhorias ou reportar problemas. Para contribuir:
1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o repositório (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` (se incluído) para detalhes.