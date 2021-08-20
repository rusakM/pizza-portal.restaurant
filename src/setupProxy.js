const { createProxyMiddleware } = require("http-proxy-middleware");
const target = "http://127.0.0.1:3002";
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
  app.use(
    "/uploads",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/broadcast", {
      target: `http://127.0.0.1:80`,
      changeOrigin: false,
    })
  );
};
