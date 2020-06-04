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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
// import { UnclaimTaskDirective } from './unclaim-task.directive';
import { TaskListService } from '../../services/tasklist.service';
import { ProcessTestingModule } from '../../../testing/process.testing.module';

describe('UnclaimTaskDirective', () => {

    @Component({
        selector:  'adf-unclaim-test-component',
        template: '<button adf-unclaim-task [taskId]="taskId"></button>'
    })
    class TestComponent {
        taskId = 'test1234';
    }

    let fixture: ComponentFixture<TestComponent>;
    let taskListService: TaskListService;

    setupTestBed({
        imports: [
          ProcessTestingModule
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        taskListService = TestBed.get(TaskListService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('Should be able to call unclaim task service', () => {
        const claimTaskSpy = spyOn(taskListService, 'unclaimTask').and.returnValue(of({}));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(claimTaskSpy).toHaveBeenCalledWith(fixture.componentInstance.taskId);
    });
});

describe('Claim Task Directive validation errors', () => {

    @Component({
        selector:  'adf-unclaim-no-fields-validation-component',
        template: '<button adf-unclaim-task></button>'
    })
    class ClaimTestMissingInputDirectiveComponent {

        // @ContentChildren(ClaimTaskDirective)
        // claimTaskValidationDirective: ClaimTaskDirective;
    }

    @Component({
        selector:  'adf-claim-no-taskid-validation-component',
        template: '<button adf-unclaim-task [taskId]=""></button>'
    })
    class ClaimTestMissingTaskIdDirectiveComponent {

        // @ContentChildren(ClaimTaskDirective)
        // claimTaskValidationDirective: ClaimTaskDirective;
    }

    let fixture: ComponentFixture<any>;

    setupTestBed({
        imports: [
          ProcessTestingModule
        ],
        declarations: [
            ClaimTestMissingTaskIdDirectiveComponent,
            ClaimTestMissingInputDirectiveComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClaimTestMissingInputDirectiveComponent);
    });

    it('should throw error when missing input', () => {
        fixture = TestBed.createComponent(ClaimTestMissingInputDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError();
    });

    it('should throw error when taskId is not set', () => {
        fixture = TestBed.createComponent(ClaimTestMissingTaskIdDirectiveComponent);
        expect( () => fixture.detectChanges()).toThrowError('Attribute taskId is required');
    });
});
