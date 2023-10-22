import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import "./ClientCreatePage.css";

export default function ClientCreatePage() {

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [redeSocial, setRedeSocial] = useState("");
  const [pessoasAutorizadas, setPessoasAutorizadas] = useState("");
  const [obsersacoes, setObsersacoes] = useState("");
  const [cep, setCep] = useState("");
  const [uf, setUf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(codigo);

    //validação
    //envio

    // limpar o form
    setCodigo("");
    setNome("");
    setCpf("");
    setDataNascimento("");
    setTelefone("");
    setRedeSocial("");
    setPessoasAutorizadas("");
    setObsersacoes("");
    setCep("");
    setUf("");
    setEndereco("");
    setCidade("");
    setBairro("");
  };

  return (
    <>
      <Helmet>
        <title> Cliente / Cadastro</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {'>'} Cliente / Cadastro
          <Divider sx={{ backgroundColor: '#606060', mb: 3 }} />
        </Typography>
        
      </Container>

      <body>
        {/* <Container maxWidth="xl"> */}
        <form onSubmit={handleSubmit}>

          <div id="campos">

            <div id="dados-pessoais">
              <div className="label-input">
                <div className="label-campos">
                  <ul>
                    <li><p>Código</p></li>
                    <li><p>Nome</p></li>
                    <li><p>CPF</p></li>
                    <li><p>Data de Nascimento</p></li>
                    <li><p>Telefone</p></li>
                    <li><p>Rede Social</p></li>
                    <li><p>Pessoas Autorizadas</p></li>
                    <li><p>Observações</p></li>
                  </ul>
                </div>

                <div className="input-campos">
                  <ul>
                    <li><input id='codigo' type="text" name="codigo" onChange={(e) => setCodigo(e.target.value)} value={codigo || ""} /></li>
                    <li><input id="nome" type="text" name="nome" onChange={(e) => setNome(e.target.value)} value={nome || ""} /></li>
                    <li><input type="text" name="cpf" onChange={(e) => setCpf(e.target.value)} value={cpf || ""} /></li>
                    <li><input type="text" name="dataNascimento" onChange={(e) => setDataNascimento(e.target.value)} value={dataNascimento || ""} /></li>
                    <li><input type="text" name="telefone" onChange={(e) => setTelefone(e.target.value)} value={telefone || ""} /></li>
                    <li><input type="text" name="redeSocial" onChange={(e) => setRedeSocial(e.target.value)} value={redeSocial || ""} /></li>
                    <li><input id="pessoasAutorizadas" type="text" name="pessoasAutorizadas" onChange={(e) => setPessoasAutorizadas(e.target.value)} value={pessoasAutorizadas || ""} /></li>
                    <li><textarea id="textarea-observacoes" name="obsersacoes" onChange={(e) => setObsersacoes(e.target.value)} value={obsersacoes || ""} /></li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="dados-endereco">
              <div className="label-input">
                <div className="label-campos">
                  <ul>
                    <li><p>CEP</p></li>
                    <li><p>UF</p></li>
                    <li><p>Endereço</p></li>
                    <li><p>Cidade</p></li>
                    <li><p>Bairro</p></li>
                  </ul>
                </div>

                <div id="input-campos">
                  <ul>
                    <li><input type="text" name="cep" onChange={(e) => setCep(e.target.value)} value={cep || ""} /></li>
                    <li><input id="uf" type="text" name="uf" onChange={(e) => setUf(e.target.value)} value={uf || ""} /></li>
                    <li><input type="text" name="endereco" onChange={(e) => setEndereco(e.target.value)} value={endereco || ""} /></li>
                    <li><input type="text" name="cidade" onChange={(e) => setCidade(e.target.value)} value={cidade || ""} /></li>
                    <li><input type="text" name="bairro" onChange={(e) => setBairro(e.target.value)} value={bairro || ""} /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="botoes-cadastro-cliente">
            <input id="salvar" type="submit" value="SALVAR" />
            <input id="cancelar" type="submit" value="CANCELAR" />
          </div>

        </form>
        {/* </Container> */}
      </body>


    </>
  );
};
