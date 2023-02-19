import { supabase } from "../services/supabase.js";
import { withAuthentication } from "../middlewares/withAuthentication.js";

export async function userRoutes(app) {
  app.post("/register", async (request, response) => {
    const { email, password, confirm_password } = request.body;

    if (!email) return { err: "missing_email" };
    if (!password) return { err: "missing_password" };
    if (!confirm_password) return { err: "missing_confirm_password" };

    if (password !== confirm_password)
      return {
        err: "passwords_unmatch",
      };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.status === 401)
        return response.status(500).send({
          err: "supabase_error",
        });
      return {
        err: "already_registered",
      };
    }

    return { accessToken: data.session.access_token };
  });

  app.post("/login", async (request, response) => {
    const { email, password } = request.body;

    if (!email) return { err: "missing_email" };
    if (!password) return { err: "missing_password" };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 401)
        return response.status(500).send({
          err: "supabase_error",
        });
      return response.status(401).send({
        err: "invalid_credentials",
      });
    }

    return { accessToken: data.session.access_token };
  });

  app.get("/me", { preHandler: [withAuthentication] }, (request, response) => {
    return { ...response.locals.user };
  });
}
