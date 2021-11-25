import {Injectable} from '@nestjs/common';
import {VaricityConfig} from '../model/config.model';
import * as fs from 'fs';

const yaml = require('js-yaml');
const path = require('path');

@Injectable()
export class AppService {

    getHello(): string {
        return 'Hello World nest !';
    }

    loadDefaultConfig(): VaricityConfig {
        // Get document, or throw exception on error
        try {
            return yaml.load(fs.readFileSync(path.join(process.cwd(), 'config/config.yaml'), 'utf8'));
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * TODO
     * Detect null or undefined fields and replace them by default values
     * @param varicityConfig
     * @returns a normalized config
     */
    normalizeConfig(varicityConfig: VaricityConfig): VaricityConfig {
        return varicityConfig
    }
}
