import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { verify } from "jsonwebtoken";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const { userId }: any = verify(token, process.env.CONFIRM_TOKEN_SECRET!);

    if (!userId) {
      return false;
    }

    await User.update({ id: userId }, { confirmed: true });

    return true;
  }
}
