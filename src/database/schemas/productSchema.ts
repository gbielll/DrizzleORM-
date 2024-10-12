//o sqliteTable vai ser usado para criamos as tabelas
//deve importar as tipagens tb
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

//defino o nome da tebla
//notNull define que a coluna nao deve ser nula
export const product = sqliteTable("products",{
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
})