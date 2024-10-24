import User from '~/models/userModel'
import { selectedObject } from '~/utils'
export interface IUser {
  userName: string
  userEmail: string
  userPhone?: number
  userAddress?: string
  avatar?: string
  role?: 'customer' | 'admin'
  password: string
  passwordChangeAt?: Date
}
interface IUserRepository {
  addUser(user: IUser): Promise<any>
  findUser(query: any): Promise<any>
  findByEmail(userEmail: string): Promise<any>
  findUsers(query: any, select?: string[]): Promise<any>
  // create(userDetails: any): Promise<any>
  updatePassword(userId: string, password: string): Promise<any>
  updateUser(userId: string, updatedUser: object): Promise<any>
  changePasswordAfter(JWTTimestamp: number, userId: string): Promise<boolean>
  getAllUser(): Promise<any>
}
class userRepository implements IUserRepository {
  async addUser(user: IUser) {
    const newUser = new User(user)
    const userSaved = await newUser.save()
    return userSaved
  }

  async findUser(query: any, select?: string[]) {
    const user = User.findOne(query).select(selectedObject(select || []))
    return user
  }

  async findUsers(query: any, select?: string[]) {
    const users = User.find(query).select(selectedObject(select || []))
    return users
  }

  async findByEmail(userEmail: string) {
    return await User.findOne({ userEmail })
  }
  async findAndUpdateMany(query: any, update: any) {
    return await User.updateMany(query, update)
  }

  // async create(userDetails: {
  //   userName: string
  //   userEmail: string
  //   password: string
  //   avatar: string
  //   userPhone: number
  // }) {
  //   const user = new User(userDetails)
  //   return await user.save()
  // }

  async updatePassword(userId: string, password: string) {
    const passwordChangeAt = Date.now() - 5000 ///để tránh trường hợp token được tạo trước khi password được thay đổi
    return await User.findByIdAndUpdate(userId, { password, passwordChangeAt }, { new: true })
  }
  async changePasswordAfter(JWTTimestamp: number, userId: string) {
    const user = await User.findById({ _id: userId })
    if (user) {
      if (user.passwordChangeAt) {
        const changedTimestamp = Math.floor(user.passwordChangeAt.getTime() / 1000)
        return JWTTimestamp < changedTimestamp
      }
    }
    return false
  }
  async updateUser(
    userId: string,
    updates: { userName?: string; avatar?: string; userPhone?: number; userAddress?: string; pushToken?: string }
  ) {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
    return user
  }
  async getAllUser() {
    const listUser = await User.find()
    return listUser
  }
}
export default userRepository
