import { supabase } from "../services/supabase.js";

export async function withAuthentication(request, response, next) {
  const { authorization } = request.headers;

  if (!authorization)
    return response.send({
      err: "missing_authorization",
    });

  const accessToken = authorization.split(" ").pop();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error)
    return response.send({
      err: "invalid_token",
    });

  response.locals = { ...data };
  next();
}
