import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDTO) {
    // generate the password
    const hash = await argon.hash(dto.password);
    // save the user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // return the saved user
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // TODO: If it is a PRISMA ERROR
        if (err.code === 'P2002') {
          // PRISMA ERROR CODE DEFINED for record unique field
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw err;
    }
  }

  async signin(dto: AuthDTO) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user doesnt exist, throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    // send back user
    return user;
  }
}
