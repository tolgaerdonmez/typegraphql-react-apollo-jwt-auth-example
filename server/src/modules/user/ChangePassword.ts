import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import bcrypt from "bcryptjs";
import { verify } from "jsonwebtoken";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput
  ): Promise<boolean> {
    const { userId }: any = verify(
      token,
      process.env.CHANGE_PASSWORD_TOKEN_SECRET!
    );

    if (!userId) {
      return false;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.save();

    return true;
  }
}
