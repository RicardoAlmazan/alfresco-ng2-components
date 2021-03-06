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

import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '../app-config/app-config.service';
import { DiscoveryApiService } from './discovery-api.service';
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { VersionCompatibilityService } from './version-compatibility.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from './authentication.service';

describe('VersionCompatibilityService', () => {
    let versionCompatibilityService: VersionCompatibilityService;
    let alfrescoApiService: AlfrescoApiServiceMock;
    let discoveryApiService: DiscoveryApiService;
    let authenticationService: AuthenticationService;

    const acsResponceMock = {
        version: {
            display: '7.0.1',
            major: '7',
            minor: '0',
            patch: '1'
        }
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(async () => {
        discoveryApiService = TestBed.inject(DiscoveryApiService);
        authenticationService = TestBed.inject(AuthenticationService);
        spyOn(discoveryApiService, 'getEcmProductInfo').and.returnValue(of(acsResponceMock));
        spyOn(authenticationService, 'isEcmLoggedIn').and.returnValue(true);
        versionCompatibilityService = TestBed.inject(VersionCompatibilityService);
        alfrescoApiService = new AlfrescoApiServiceMock(new AppConfigService(null), null);
        versionCompatibilityService = new VersionCompatibilityService(
            alfrescoApiService,
            authenticationService,
            discoveryApiService
        );
        await alfrescoApiService.initialize();
    });

    it('should get ACS running version', () => {
        const acsVersion = versionCompatibilityService.getAcsVersion();
        expect(acsVersion).toBeDefined();
        expect(acsVersion.display).toBe('7.0.1');
    });

    it('should validate give version', () => {
        expect(versionCompatibilityService.getAcsVersion()).toEqual({ display: '7.0.1', major: '7', minor: '0', patch: '1' } as any);
        expect(versionCompatibilityService.isVersionSupported('8.0.0')).toBe(false);
        expect(versionCompatibilityService.isVersionSupported('7.0.1')).toBe(true);
        expect(versionCompatibilityService.isVersionSupported('7.0.0')).toBe(true);
        expect(versionCompatibilityService.isVersionSupported('6.0.0')).toBe(true);
    });
});
