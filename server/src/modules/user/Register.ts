import { Resolver, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { sendMail } from "../../utils/sendMail";
import { createConfirmationToken } from "../../utils/auth";

@Resolver()
export class RegisterResolver {
  @Mutation(() => Boolean)
  async register(
    @Arg("data") { email, password, firstName, lastName }: RegisterInput
  ): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      }).save();

      const token = createConfirmationToken(user);
      const url = process.env.CLIENT_URL + "/user/confirm/" + token;
      await sendMail("Confirm your new created user account", email, url);

      return true;
    } catch (error) {
      return false;
    }
  }
}
