import { User } from "models/user";
import { Auth } from "models/auth";
import { addMinutes } from "date-fns";
import { sgMail } from "lib/sendgrid";
import { generate } from "lib/jwt";
import uniqueRandom from "unique-random";
const random = uniqueRandom(10000, 99999);

export async function findOrCreateAuth(email: string): Promise<Auth> {
  const cleanEmail = email.trim().toLowerCase();

  const auth = await Auth.findByEmail(cleanEmail);
  //si lo encuentro lo devuevlo
  if (auth) {
    return auth;
  } else {
    //sino lo tengo que crear con el metodo estatico del modelo user
    const newUser = await User.createNewUser({ email: cleanEmail });
    //y despues creo el auth con la instancia del user creada
    const newAuth = await Auth.createNewAuth({
      email: cleanEmail,
      userId: newUser.id,
      code: "",
      expires: "",
    });
    return newAuth;
  }
}

async function sendEmailWithCode(to: string, code) {
  const msg = {
    to: to,
    from: "joaquingiacusa.dev@gmail.com", // Use the email address or domain you verified above
    subject: "Codigo de ingreso",
    text: "code...",
    html: "<strong>Codigo de ingreso: " + code.toString() + "</strong>",
  };

  try {
    await sgMail.send(msg);
    return { message: "mensaje enviado" };
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

export async function sendCode(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  const auth = await findOrCreateAuth(cleanEmail);
  var code = random().toString();

  //creo la fecha de ahora y le agrego 20 min de vencimiento con la lib date-fns
  const now = new Date();
  const trwntyMinutesFromNow = addMinutes(now, 20);

  auth.data.code = { code, valid: true };
  auth.data.expires = trwntyMinutesFromNow;

  await sendEmailWithCode(cleanEmail, auth.data.code.code);
  await auth.push();
  return true;
}

export async function signIn(email: string, code: string) {
  const auth = await Auth.findByEmailAndCode(email, code);

  if (!auth) {
    throw "email o codigo incorrecto";
  }

  const isExpires = auth.isCodeExpired();
  if (auth.data.code.valid == false || isExpires) {
    throw "codigo expirado";
  } else {
    const token = generate({ userId: auth.data.userId });

    auth.invalidateCode();
    return token;
  }
}
