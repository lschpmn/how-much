import { exists, read, writeAsync } from 'fs-jetpack';
import { cloneDeep, throttle } from 'lodash';
import { join } from 'path';
import { startingTypeObj } from '../../constants';
import { DbSchema, Dosage } from '../../types';

const DB_PATH = join(__dirname, '../..', 'bin', 'db.json');

class DB {
  data: DbSchema;

  constructor() {
    if (exists(DB_PATH)) {
      this.data = read(DB_PATH, 'json');

      if (!this.data.typeObj) {
        this.data.typeObj = startingTypeObj;
        this.data.dosages.forEach(d => d.typeId = 'aaaaaaaa');
        this.save();
      }
    } else {
      this.data = {
        dosages: [],
        typeObj: startingTypeObj,
      };

      this.save();
    }
  }

  // Dosages

  addDosage(dosage: Dosage) {
    this.data.dosages.push(dosage);
    this.data.dosages.sort((a, b) => b.timestamp - a.timestamp);
    this.save();
  }

  deleteDosage(id: string) {
    this.data.dosages = this.data.dosages.filter(d => d.id !== id);
    this.save();
  }

  getDosages(): Dosage[] {
    return cloneDeep(this.data.dosages);
  }

  // Types

  getTypes() {
    return cloneDeep(this.data.typeObj);
  }

  private save = throttle(() => {
    writeAsync(DB_PATH, this.data, { atomic: true })
      .catch(err => {
        console.error('Error writing db!');
        console.log(err);
        this.save();
      });
  }, 2000);
}

export default new DB();
