export const fetcher = (
  input: RequestInfo,
  init?: RequestInit | undefined,
  withAuth = true
) => {
  //   console.log('[fetcher]', input, init, btype))
  return new Promise<Response>((resolve, reject) => {
    fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
        ...(withAuth
          ? {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          : {}),
      },
    })
      .then(resolve)
      .catch((er) => {
        // if i get a 401 error, remove the token and reload the page
        if (
          er.status === 401 &&
          (input.toString().startsWith("https://api.disadus.app") ||
            input.toString().startsWith("http://localhost:443"))
        ) {
          localStorage.removeItem("token");
        }
        reject(er);
      });
    //   console.log('Requesting', input, btype, requestBuckets))
  });
};
