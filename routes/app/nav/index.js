const router = require("koa-router")();
router
  .get("/", async (ctx, next) => {
    const {state, nkcModules} = ctx;
    ctx.template = "app/nav/nav.pug";
    await nkcModules.apiFunction.extendManagementInfo(ctx);
    await next();
  });
module.exports = router;
