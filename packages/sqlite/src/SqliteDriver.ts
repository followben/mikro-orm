import { AnyEntity, Configuration, EntityData, QueryResult, Transaction } from '@mikro-orm/core';
import { AbstractSqlDriver, Knex } from '@mikro-orm/knex';
import { SqliteConnection } from './SqliteConnection';
import { SqlitePlatform } from './SqlitePlatform';

export class SqliteDriver extends AbstractSqlDriver<SqliteConnection> {

  constructor(config: Configuration) {
    super(config, new SqlitePlatform(), SqliteConnection, ['knex', 'sqlite3']);
  }

  async nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityData<T>[], ctx?: Transaction<Knex.Transaction>): Promise<QueryResult> {
    const res = await super.nativeInsertMany(entityName, data, ctx);
    const pks = this.getPrimaryKeyFields(entityName);
    const first = res.insertId - data.length + 1;
    data.forEach((item, idx) => res.rows![idx] = { [pks[0]]: item[pks[0]] ?? first + idx });

    return res;
  }

}
