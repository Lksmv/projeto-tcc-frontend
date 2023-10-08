import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const produtos = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  imagem: faker.image.business(),
  nome: faker.name.fullName(),
  tamanho: 'X',
  cor: 'XXXX',
  preco: faker.number.float()
}));

export default produtos;
