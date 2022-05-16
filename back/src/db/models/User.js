import { UserModel } from "../schemas/user";

class User {
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async findByEmail({ email }) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  /**
   * google 로그인시 가입여부 확인하는 함수
   */
  static async findByGoogleEmail({ profile }) {
    const user = await UserModel.findOne({
      where:{
        email:profile.emails[0].value,
        provider:'google'
      }
    })
    return user;
  }

  /**
   * name으로 user리스트를 찾아 페이징처리하여 반환하는 함수
   */
  static async findPageListByName({name, page, perPage, sortField}){
    //name 정규식에 따른 user 리스트 불러오기
    //paging 처리
    //sortField 기준으로 정렬
    if (sortField == null) {
      return await UserModel.find({
        name: { $regex: name, $options: "i" }
      })
      .sort({createdAt: -1}) //createAt 기준으로 정렬
      .limit(perPage) //한페이지에서 확인할 수 있는 결과의 수
      .skip((page - 1) * perPage) //페이지에 따른 skip 기준
      .lean();
    } 
  }
  

  static async findById({ user_id }) {
    const user = await UserModel.findOne({ id: user_id });
    return user;
  }

  static async findAll() {
    const users = await UserModel.find({});
    return users;
  }

  static async update({ user_id, fieldToUpdate, newValue }) {
    const filter = { id: user_id };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };

    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedUser;
  }
}

export { User };
