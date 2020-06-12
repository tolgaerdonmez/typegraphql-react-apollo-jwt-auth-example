import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { sendMail } from "../../utils/sendMail";
import { sign } from "jsonwebtoken";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = sign(
      { userId: user.id },
      process.env.CHANGE_PASSWORD_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    const url = process.env.CLIENT_URL + "/user/change-password/" + token;

    await sendMail("Forgot your password ? We got your back 👍", email, url);

    return true;
  }
}
