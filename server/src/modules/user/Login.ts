import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Field,
  Int,
} from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import {
  createRefreshToken,
  createAccessToken,
  sendRefreshToken,
} from "../../utils/auth";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Cannot find user!");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Password invalid!");
    }

    if (!user.confirmed) {
      throw new Error("Cannot find user!");
    }

    sendRefreshToken(ctx.res, createRefreshToken(user));

    return { accessToken: createAccessToken(user) };
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }
}
