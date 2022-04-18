import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserDto } from "src/users/dto/user.dto";

interface ClassConstructor {
    new (...args:any[]) : {};
}

export function Serielize(dto:ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto:any){}
    
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
                
        return next.handle().pipe(
            map((data:any) => {
                return plainToInstance(this.dto,data,{
                    excludeExtraneousValues:true
                });
            })
        );
    }

}