import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schemas/*', //representa cada tabela q vai exisit no banco de dados e o * fala que é todos os arquivos dentro daquela pasta
  out: './drizzle',
    dialect: 'sqlite', //define o banco
  driver: 'expo', 
} satisfies Config;