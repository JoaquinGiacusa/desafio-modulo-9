import { User } from "models/user";
import { object } from "yup";

export async function getUserById(id: string): Promise<any> {
  //genero una instancia con el id que recibo despues de decodear el token
  const user = new User(id);
  //lo traigo
  await user.pull();
  return user.data;
}

export async function updateUser(newUserData: object, userId: string) {
  const user = new User(userId);
  await user.pull();
  if (!user) {
    throw "error obteniendo el usuario";
  }

  if (Object.keys(newUserData).length != 0) {
    user.data = newUserData;
    await user.push();
    return "user updated";
  } else {
    return "not new data to update";
  }
}

export async function updateUserAddress(newAddres: string, userId: string) {
  const user = new User(userId);
  await user.pull();
  if (!user) {
    throw "error obteniendo el usuario";
  }

  if (newAddres) {
    user.data.address = newAddres;
    await user.push();
    return "user addres updated";
  }
}
