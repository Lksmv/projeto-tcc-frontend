# Sistema de Gestão Roberta Aluguel de Trajes

## Introdução

Este repositório contém o código-fonte e a documentação associada ao Sistema de Gestão Roberta Aluguel de Trajes, desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) no curso de Sistemas de Informação da FURB - Blumenau. O trabalho está sendo orientado pela mestra Simone Erbs da Costa.

## Objetivo

O principal objetivo deste projeto é disponibilizar um sistema de gestão web que visa a automação de processos manuais, facilitando o gerenciamento de cadastros e consultas para funcionários/administradores e aprimorando a visibilidade dos produtos da loja para os clientes.

## Funcionalidades

O sistema consiste em um conjunto de funcionalidades, incluindo:

- **Gestão de Cadastros:** Facilita o cadastro e a manutenção de informações sobre produtos, clientes, e outros elementos relevantes para a operação da loja.

- **Catálogo de Produtos:** Permite aos clientes visualizar o catálogo de produtos disponíveis, com informações detalhadas, imagens e preços.

## Tecnologias Utilizadas

- **Banco de Dados:** PostgresSQL foi escolhido para armazenamento eficiente e confiável dos dados.

- **Backend:** Desenvolvido em Java, utilizando o framework Spring para a implementação eficiente de lógica de negócios.

- **Armazenamento de Imagens:** As imagens são salvas em um bucket do Google Cloud, garantindo escalabilidade e confiabilidade.

- **Frontend:** Desenvolvido em React, seguindo os padrões do Material Design com a utilização do Material-UI (mui) para a interface do usuário.

- **Prototipagem:** Protótipos foram criados no Figma para visualização e validação das interfaces antes da implementação.

## Instruções de Execução

1. **Clonagem do Repositório:**
   ```bash
   Frontend: git clone https://github.com/Lksmv/projeto-tcc-frontend
   Backend:  git clone https://github.com/Lksmv/projeto-tcc-backend

2. **Backend:**
   ```bash
    1. Configure o ambiente Java e Spring.
    2. Importe o projeto e as dependências utilizando sua IDE preferida.
    3. Configure o banco de dados PostgresSQL.
    4. Configure as VM args
    (
    -Dspring.datasource.url= url_conexao_bd
    -Dspring.datasource.username= user_bd
    -Dspring.datasource.password= senha_bd
    -Dspring.datasource.hikari.schema= nome_schema_bd
    -Djwt.secret= secret_para_token
    )
    5. Crie o arquivo credentials.json na root do projeto caso não houver e salve suas 
       credenciais do google cloud para utilização do bucket
    6. Execute a aplicação Spring Boot.

3. **Frontend:**

- *Instale as dependências e faça o build com:*
   ```bash
    npm install
    npm run build

- Configure na .env o local do backend

- *Inicie a aplicação React:*
   ```bash
    npm start

4. **Acesso:**

- *Acesse o catálogo através do navegador: http://localhost:3000*
- *Acesse o sistema através do navegador: http://localhost:3000/login*

- O sistema cria um usuário por padrão: Login= admin | senha= admin123

## Contribuições e Problemas

Contribuições são bem-vindas! Se encontrar problemas ou tiver sugestões, por favor, abra uma *issue* neste repositório.

---

*Este projeto é parte integrante do Trabalho de Conclusão de Curso na FURB - Blumenau e é distribuído sob a licença [MIT](LICENSE).*

*Desenvolvido por Amanda Miranda Zanella e Lucas Miguel Vieira.*



