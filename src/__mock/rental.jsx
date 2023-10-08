import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const rental = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cliente: faker.name.fullName(),
  produto: 'vestido',
  qtdProdutos: '1',
  saida: '11/11/2023',
  devolucao: '11/12/2023',
  valor: '100,00',
  finalizado: 'N',
}));

export default rental;
