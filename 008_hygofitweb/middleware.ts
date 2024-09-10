const deviceMiddleware = async (req: Request) => {
  const headers = new Headers(req.headers);
  const deviceId = headers.get("Device-ID");
};

export default deviceMiddleware;
