import type { Response } from "express";
import type { ZodError } from "zod";
import { MESSAGES, STATUS_CODE } from "./constant.ts";
import { sendError } from "./response.ts";

export function sendValidationError(
        res: Response,
        error: ZodError
): void {
 
                const validation_error = error.issues.map((issue)=>{
                        return {
                                path:issue.path.join("."),
                                message:issue.message
                        }
                })
      
        sendError(
                res,
                STATUS_CODE.BAD_REQUEST as number,
               MESSAGES.VALIDATION_ERROR as string,
               validation_error
        )
}