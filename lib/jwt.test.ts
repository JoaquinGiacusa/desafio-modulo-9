import { generate, decode } from "./jwt";
import test from "ava";

test("jwt encode/decode", (t) => {
  const payload = { marce: true };
  const token = generate(payload);

  const decoded = decode(token);
  delete decoded.iat;

  t.deepEqual(payload, decoded);
});

// test("bar", async (t) => {
//   const bar = Promise.resolve("bar");
//   t.is(await bar, "bar");
// });
