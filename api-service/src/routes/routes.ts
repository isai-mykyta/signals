/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TasksController } from './../controllers/tasks';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StrategiesController } from './../controllers/strategies';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SignalsController } from './../controllers/signals';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MarketsController } from './../controllers/markets';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "TaskStatus": {
        "dataType": "refEnum",
        "enums": ["PENDING","RUNNING","COMPLETED","STOPPED"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TasksDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "strategyId": {"dataType":"double","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
            "startedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},
            "endedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}],"required":true},
            "lastSignalAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            "status": {"ref":"TaskStatus","required":true},
            "isActive": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HttpStatusCode": {
        "dataType": "refEnum",
        "enums": [400,500,404],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomErrorType": {
        "dataType": "refEnum",
        "enums": [0,1],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.unknown_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApplicationError": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
            "statusCode": {"ref":"HttpStatusCode"},
            "type": {"ref":"CustomErrorType","required":true},
            "details": {"dataType":"union","subSchemas":[{"ref":"Record_string.unknown_"},{"dataType":"string"},{"dataType":"double"},{"dataType":"array","array":{"dataType":"string"}},{"dataType":"array","array":{"dataType":"double"}}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Task.strategyId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"strategyId":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchTasksOptions": {
        "dataType": "refObject",
        "properties": {
            "ids": {"dataType":"array","array":{"dataType":"double"}},
            "strategyIds": {"dataType":"array","array":{"dataType":"double"}},
            "startedAtFrom": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},
            "endedAtFrom": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},
            "lastSignalAtFrom": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},
            "statuses": {"dataType":"array","array":{"dataType":"refEnum","ref":"TaskStatus"}},
            "isActive": {"dataType":"boolean"},
            "from": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "limit": {"dataType":"double"},
            "offset": {"dataType":"double"},
            "to": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "order": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ASC"]},{"dataType":"enum","enums":["DESC"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StrategyRuleType.PERCENTAGE_CHANGE": {
        "dataType": "refEnum",
        "enums": ["PERCENTAGE_CHANGE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Comprasion": {
        "dataType": "refEnum",
        "enums": ["GREATER_THAN","LESS_THAN","EQUALS","NOT_EQUALS"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TimeFrameUnit": {
        "dataType": "refEnum",
        "enums": ["SECONDS","MINUTES","HOURS","DAYS"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TimeFrame": {
        "dataType": "refObject",
        "properties": {
            "amount": {"dataType":"double","required":true},
            "unit": {"ref":"TimeFrameUnit","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PricePercentageChangeRule": {
        "dataType": "refObject",
        "properties": {
            "type": {"ref":"StrategyRuleType.PERCENTAGE_CHANGE","required":true},
            "comparison": {"ref":"Comprasion","required":true},
            "value": {"dataType":"double","required":true},
            "timeFrame": {"ref":"TimeFrame","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StrategyRule": {
        "dataType": "refAlias",
        "type": {"ref":"PricePercentageChangeRule","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActionType.TELEGRAM_NOTIFICATION": {
        "dataType": "refEnum",
        "enums": ["TELEGRAM_NOTIFICATION"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TelegramNotification": {
        "dataType": "refObject",
        "properties": {
            "type": {"ref":"ActionType.TELEGRAM_NOTIFICATION","required":true},
            "payload": {"dataType":"any","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StrategyAction": {
        "dataType": "refAlias",
        "type": {"ref":"TelegramNotification","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TaskType": {
        "dataType": "refEnum",
        "enums": ["ONE_TIME","CONTINUOUS"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TaskSchedule": {
        "dataType": "refObject",
        "properties": {
            "startAt": {"dataType":"double"},
            "endAt": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StrategiesDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "createdAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "assets": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "rules": {"dataType":"array","array":{"dataType":"refAlias","ref":"StrategyRule"},"required":true},
            "actions": {"dataType":"array","array":{"dataType":"refAlias","ref":"StrategyAction"},"required":true},
            "taskType": {"ref":"TaskType","required":true},
            "taskSchedule": {"ref":"TaskSchedule","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Strategy.Exclude_keyofStrategy.id-or-createdAt-or-updatedAt-or-isActive__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"marketId":{"dataType":"double","required":true},"assets":{"dataType":"array","array":{"dataType":"string"},"required":true},"rules":{"dataType":"array","array":{"dataType":"refObject","ref":"PricePercentageChangeRule"},"required":true},"actions":{"dataType":"array","array":{"dataType":"refObject","ref":"TelegramNotification"},"required":true},"taskType":{"ref":"TaskType","required":true},"taskSchedule":{"ref":"TaskSchedule"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Strategy.id-or-createdAt-or-updatedAt-or-isActive_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Strategy.Exclude_keyofStrategy.id-or-createdAt-or-updatedAt-or-isActive__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchStrategiesOptions": {
        "dataType": "refObject",
        "properties": {
            "ids": {"dataType":"array","array":{"dataType":"double"}},
            "names": {"dataType":"array","array":{"dataType":"string"}},
            "from": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "limit": {"dataType":"double"},
            "offset": {"dataType":"double"},
            "to": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "marketIds": {"dataType":"array","array":{"dataType":"double"}},
            "isActive": {"dataType":"boolean"},
            "assets": {"dataType":"array","array":{"dataType":"string"}},
            "order": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ASC"]},{"dataType":"enum","enums":["DESC"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignalsDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "strategyId": {"dataType":"double","required":true},
            "taskId": {"dataType":"double","required":true},
            "asset": {"dataType":"string","required":true},
            "marketId": {"dataType":"double","required":true},
            "producedAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "actionsTriggered": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"refAlias","ref":"StrategyAction"}},{"dataType":"enum","enums":[null]}],"required":true},
            "metadata": {"dataType":"any","required":true},
            "createdAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Signal.Exclude_keyofSignal.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"strategyId":{"dataType":"double","required":true},"marketId":{"dataType":"double","required":true},"taskId":{"dataType":"double","required":true},"asset":{"dataType":"string","required":true},"producedAt":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},"actionsTriggered":{"dataType":"array","array":{"dataType":"refObject","ref":"TelegramNotification"}},"metadata":{"dataType":"any"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Signal.id-or-createdAt-or-updatedAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Signal.Exclude_keyofSignal.id-or-createdAt-or-updatedAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchSignalsOptions": {
        "dataType": "refObject",
        "properties": {
            "ids": {"dataType":"array","array":{"dataType":"double"}},
            "strategyIds": {"dataType":"array","array":{"dataType":"double"}},
            "taskIds": {"dataType":"array","array":{"dataType":"double"}},
            "assets": {"dataType":"array","array":{"dataType":"string"}},
            "marketIds": {"dataType":"array","array":{"dataType":"double"}},
            "from": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "limit": {"dataType":"double"},
            "offset": {"dataType":"double"},
            "to": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "order": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ASC"]},{"dataType":"enum","enums":["DESC"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MarketResponseDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Market.name-or-url_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchMarketsOptions": {
        "dataType": "refObject",
        "properties": {
            "ids": {"dataType":"array","array":{"dataType":"double"}},
            "names": {"dataType":"array","array":{"dataType":"string"}},
            "url": {"dataType":"string"},
            "from": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "limit": {"dataType":"double"},
            "offset": {"dataType":"double"},
            "to": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "order": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ASC"]},{"dataType":"enum","enums":["DESC"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsTasksController_createTask: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"Pick_Task.strategyId_"},
        };
        app.post('/tasks',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.createTask)),

            async function TasksController_createTask(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_createTask, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'createTask',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTasksController_getTaskById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/tasks/:id',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.getTaskById)),

            async function TasksController_getTaskById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_getTaskById, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'getTaskById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTasksController_searchTasks: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"SearchTasksOptions"},
        };
        app.get('/tasks',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.searchTasks)),

            async function TasksController_searchTasks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_searchTasks, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'searchTasks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTasksController_deleteTaskById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/tasks/:id',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.deleteTaskById)),

            async function TasksController_deleteTaskById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_deleteTaskById, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'deleteTaskById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTasksController_logTaskSignal: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.post('/tasks/:id/log',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.logTaskSignal)),

            async function TasksController_logTaskSignal(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_logTaskSignal, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'logTaskSignal',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTasksController_runTaskById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.post('/tasks/:id/run',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.runTaskById)),

            async function TasksController_runTaskById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_runTaskById, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'runTaskById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTasksController_completeTaskById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.post('/tasks/:id/complete',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.completeTaskById)),

            async function TasksController_completeTaskById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_completeTaskById, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'completeTaskById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTasksController_stopTaskById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.post('/tasks/:id/stop',
            ...(fetchMiddlewares<RequestHandler>(TasksController)),
            ...(fetchMiddlewares<RequestHandler>(TasksController.prototype.stopTaskById)),

            async function TasksController_stopTaskById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTasksController_stopTaskById, request, response });

                const controller = new TasksController();

              await templateService.apiHandler({
                methodName: 'stopTaskById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStrategiesController_createStrategy: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"Omit_Strategy.id-or-createdAt-or-updatedAt-or-isActive_"},
        };
        app.post('/strategies',
            ...(fetchMiddlewares<RequestHandler>(StrategiesController)),
            ...(fetchMiddlewares<RequestHandler>(StrategiesController.prototype.createStrategy)),

            async function StrategiesController_createStrategy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStrategiesController_createStrategy, request, response });

                const controller = new StrategiesController();

              await templateService.apiHandler({
                methodName: 'createStrategy',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStrategiesController_getStrategyById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/strategies/:id',
            ...(fetchMiddlewares<RequestHandler>(StrategiesController)),
            ...(fetchMiddlewares<RequestHandler>(StrategiesController.prototype.getStrategyById)),

            async function StrategiesController_getStrategyById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStrategiesController_getStrategyById, request, response });

                const controller = new StrategiesController();

              await templateService.apiHandler({
                methodName: 'getStrategyById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStrategiesController_searchStrategies: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"SearchStrategiesOptions"},
        };
        app.get('/strategies',
            ...(fetchMiddlewares<RequestHandler>(StrategiesController)),
            ...(fetchMiddlewares<RequestHandler>(StrategiesController.prototype.searchStrategies)),

            async function StrategiesController_searchStrategies(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStrategiesController_searchStrategies, request, response });

                const controller = new StrategiesController();

              await templateService.apiHandler({
                methodName: 'searchStrategies',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStrategiesController_deleteStrategyById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/strategies/:id',
            ...(fetchMiddlewares<RequestHandler>(StrategiesController)),
            ...(fetchMiddlewares<RequestHandler>(StrategiesController.prototype.deleteStrategyById)),

            async function StrategiesController_deleteStrategyById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStrategiesController_deleteStrategyById, request, response });

                const controller = new StrategiesController();

              await templateService.apiHandler({
                methodName: 'deleteStrategyById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStrategiesController_activateStrategyById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.post('/strategies/:id/activate',
            ...(fetchMiddlewares<RequestHandler>(StrategiesController)),
            ...(fetchMiddlewares<RequestHandler>(StrategiesController.prototype.activateStrategyById)),

            async function StrategiesController_activateStrategyById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStrategiesController_activateStrategyById, request, response });

                const controller = new StrategiesController();

              await templateService.apiHandler({
                methodName: 'activateStrategyById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStrategiesController_disableStrategyById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.post('/strategies/:id/disable',
            ...(fetchMiddlewares<RequestHandler>(StrategiesController)),
            ...(fetchMiddlewares<RequestHandler>(StrategiesController.prototype.disableStrategyById)),

            async function StrategiesController_disableStrategyById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStrategiesController_disableStrategyById, request, response });

                const controller = new StrategiesController();

              await templateService.apiHandler({
                methodName: 'disableStrategyById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSignalsController_createSignal: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"Omit_Signal.id-or-createdAt-or-updatedAt_"},
        };
        app.post('/signals',
            ...(fetchMiddlewares<RequestHandler>(SignalsController)),
            ...(fetchMiddlewares<RequestHandler>(SignalsController.prototype.createSignal)),

            async function SignalsController_createSignal(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSignalsController_createSignal, request, response });

                const controller = new SignalsController();

              await templateService.apiHandler({
                methodName: 'createSignal',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSignalsController_getSignalById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/signals/:id',
            ...(fetchMiddlewares<RequestHandler>(SignalsController)),
            ...(fetchMiddlewares<RequestHandler>(SignalsController.prototype.getSignalById)),

            async function SignalsController_getSignalById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSignalsController_getSignalById, request, response });

                const controller = new SignalsController();

              await templateService.apiHandler({
                methodName: 'getSignalById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSignalsController_searchSignals: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"SearchSignalsOptions"},
        };
        app.get('/signals',
            ...(fetchMiddlewares<RequestHandler>(SignalsController)),
            ...(fetchMiddlewares<RequestHandler>(SignalsController.prototype.searchSignals)),

            async function SignalsController_searchSignals(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSignalsController_searchSignals, request, response });

                const controller = new SignalsController();

              await templateService.apiHandler({
                methodName: 'searchSignals',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSignalsController_deleteSignalById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/signals/:id',
            ...(fetchMiddlewares<RequestHandler>(SignalsController)),
            ...(fetchMiddlewares<RequestHandler>(SignalsController.prototype.deleteSignalById)),

            async function SignalsController_deleteSignalById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSignalsController_deleteSignalById, request, response });

                const controller = new SignalsController();

              await templateService.apiHandler({
                methodName: 'deleteSignalById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMarketsController_createMarket: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"Pick_Market.name-or-url_"},
        };
        app.post('/markets',
            ...(fetchMiddlewares<RequestHandler>(MarketsController)),
            ...(fetchMiddlewares<RequestHandler>(MarketsController.prototype.createMarket)),

            async function MarketsController_createMarket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMarketsController_createMarket, request, response });

                const controller = new MarketsController();

              await templateService.apiHandler({
                methodName: 'createMarket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMarketsController_getMarketById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/markets/:id',
            ...(fetchMiddlewares<RequestHandler>(MarketsController)),
            ...(fetchMiddlewares<RequestHandler>(MarketsController.prototype.getMarketById)),

            async function MarketsController_getMarketById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMarketsController_getMarketById, request, response });

                const controller = new MarketsController();

              await templateService.apiHandler({
                methodName: 'getMarketById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMarketsController_searchMarkets: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"SearchMarketsOptions"},
        };
        app.get('/markets',
            ...(fetchMiddlewares<RequestHandler>(MarketsController)),
            ...(fetchMiddlewares<RequestHandler>(MarketsController.prototype.searchMarkets)),

            async function MarketsController_searchMarkets(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMarketsController_searchMarkets, request, response });

                const controller = new MarketsController();

              await templateService.apiHandler({
                methodName: 'searchMarkets',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMarketsController_deleteMarketById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/markets/:id',
            ...(fetchMiddlewares<RequestHandler>(MarketsController)),
            ...(fetchMiddlewares<RequestHandler>(MarketsController.prototype.deleteMarketById)),

            async function MarketsController_deleteMarketById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMarketsController_deleteMarketById, request, response });

                const controller = new MarketsController();

              await templateService.apiHandler({
                methodName: 'deleteMarketById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMarketsController_updateMarketById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"Pick_Market.name-or-url_"},
        };
        app.put('/markets/:id',
            ...(fetchMiddlewares<RequestHandler>(MarketsController)),
            ...(fetchMiddlewares<RequestHandler>(MarketsController.prototype.updateMarketById)),

            async function MarketsController_updateMarketById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMarketsController_updateMarketById, request, response });

                const controller = new MarketsController();

              await templateService.apiHandler({
                methodName: 'updateMarketById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
