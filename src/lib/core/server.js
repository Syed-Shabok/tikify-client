export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverMutation = async (path, method, data) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  // console.log("Server Fetch res: ", res);

  return res.json();
};

export const deleteMutation = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "DELETE",
  });

  return res.json();
};
