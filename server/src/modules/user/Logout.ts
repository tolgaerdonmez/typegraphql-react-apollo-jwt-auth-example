import { Resolver, Mutation, Ctx } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { sendRefreshToken } from "../../utils/auth";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): boolean {
    sendRefreshToken(res, "");
    return true;
  }
}
