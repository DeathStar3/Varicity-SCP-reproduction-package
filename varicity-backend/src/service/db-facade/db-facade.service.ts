import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

/**
 * This service is a facade in front of the database. No other services must instantiate a JsonDB object to access the database
 * Otherwise there will be inconsistence in the content of the file because the modifications of one instance of JsonDB won't be visible to all
 * the other instances and one instance can overwrite what the other instance has done
 *
 * NestJs use Singleton by default for its services so we are sure that with the interface there will be only one database object.
 */
@Injectable()
export class DbFacadeService {
  private readonly _db: JsonDB;
  private readonly databasePath: string;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.databasePath = this.configService.get<string>('DATABASE_PATH');
    this._db = new JsonDB(new Config(this.databasePath, true, true, '/'));
  }

  public get db(): JsonDB {
    return this._db;
  }
}