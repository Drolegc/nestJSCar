import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SerializeInterceptor, Serielize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.services';
import { CurrentUser } from './decoratos/create-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serielize(UserDto)
export class UsersController {

    constructor(private usersService:UsersService,private authService: AuthService){}

    @Post('signup')
    async createUser(@Body() userDto:CreateUserDto, @Session() session:any){
        const user = await this.authService.signup(userDto.email,userDto.password);
        session.userId = user.id;
        return user;
    }

    @Post('signin')
    async singin(@Body() body: CreateUserDto,@Session() session:any) {
        const user = await this.authService.signin(body.email,body.password);
        session.userId = user.id;
        return user;
    }

    @Post('signout')
    signout(@Session() session:any) {
        session.userId = null;
    }

    @Get('me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user:User ){
        return user;
    }


    @Get(':id')
    findUser(@Param('id') id:string){
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email:string){
        return this.usersService.find(email);
    }

    @Delete(':id')
    removeUser(@Param('id') id:string){
        return this.usersService.remove(parseInt(id));
    }

    @Put(':id')
    updateUser(@Body() body:UpdateUserDto, @Param('id') id:string){
        return this.usersService.update(parseInt(id),body);
    }

}


