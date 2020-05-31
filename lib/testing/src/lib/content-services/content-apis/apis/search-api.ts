/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GenericApi } from './generic-api';
import { Logger } from '../../../core/utils/logger';
import { ApiUtil } from '../../../core/structure/api.util';
import { SearchApi as SearchJsApi, AlfrescoApi, ResultSetPaging } from '@alfresco/js-api';

export class SearchApi extends GenericApi {
  searchApi: SearchJsApi;

  constructor(username: string, password: string, alfrescoJsApi: AlfrescoApi) {
    super(username, password, alfrescoJsApi);
    this.searchApi = new SearchJsApi(alfrescoJsApi);
  }

  async queryRecentFiles(username: string): Promise<ResultSetPaging> {
    const data = {
        query: {
            query: '*',
            language: 'afts'
        },
        filterQueries: [
            { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
            { query: `cm:modifier:${username} OR cm:creator:${username}` },
            { query: `TYPE:"content" AND -TYPE:"app:filelink" AND -TYPE:"fm:post"` }
        ]
    };

    try {
      await this.login();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.queryRecentFiles.name}`, error);
      return null;
    }
  }

  async queryNodesNames(searchTerm: string): Promise<ResultSetPaging> {
    const data = {
      query: {
        query: `cm:name:\"${searchTerm}*\"`,
        language: 'afts'
      },
      filterQueries: [
        { query: `+TYPE:'cm:folder' OR +TYPE:'cm:content'`}
      ]
    };

    try {
      await this.login();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.queryNodesNames.name}`, error);
      return null;
    }
  }

  async queryNodesExactNames(searchTerm: string): Promise<ResultSetPaging> {
    const data = {
      query: {
        query: `cm:name:\"${searchTerm}\"`,
        language: 'afts'
      },
      filterQueries: [
        { query: `+TYPE:'cm:folder' OR +TYPE:'cm:content'`}
      ]
    };

    try {
      await this.login();
      return this.searchApi.search(data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.queryNodesExactNames.name}`, error);
      return null;
    }
  }

  async waitForApi(username: string, data: { expect: number }): Promise<any> {
    try {
      const recentFiles = async () => {
        const totalItems = (await this.queryRecentFiles(username)).list.pagination.totalItems;
        if ( totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await ApiUtil.retryCall(recentFiles);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.waitForApi.name} catch: `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }

  async waitForNodes(searchTerm: string, data: { expect: number }): Promise<any> {
    try {
      const nodes = async () => {
        const totalItems = (await this.queryNodesNames(searchTerm)).list.pagination.totalItems;
        if ( totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };

      return await ApiUtil.retryCall(nodes);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.waitForNodes.name} catch: `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
