import TokenData from './tokenData.interface';
import { IUserResponse } from "../models/user.model";

interface TokenDataWithUser extends TokenData {
  user: IUserResponse
}

export default TokenDataWithUser;
