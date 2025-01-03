import { Request, Response, NextFunction } from "express";

import { 
  ActionType, 
  StrategyAction, 
  StrategyRule, 
  StrategyRuleType 
} from "../types";
import { 
  CreateStrategyRequestValidator, 
  PricePercentageChangeRuleValidator, 
  TelegramNotificationActionValidator 
} from "../validators";
import { validateData } from "./validateData";

export const validateStrategyPaylod = () => {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    await validateData(CreateStrategyRequestValidator, req.body, next);

    req.body.actions.forEach(async (action: StrategyAction) => {
      if (action.type === ActionType.TELEGRAM_NOTIFICATION) {
        await validateData(TelegramNotificationActionValidator, action, next);
      }
    });

    req.body.rules.forEach(async (rule: StrategyRule) => {
      if (rule.type === StrategyRuleType.PERCENTAGE_CHANGE) {
        await validateData(PricePercentageChangeRuleValidator, rule, next);
      }
    });

    next();
  };
};
