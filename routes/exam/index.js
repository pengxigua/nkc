const Router = require('koa-router');
const examRouter = new Router();
const categoryRouter = require('./category');
const categoriesRouter = require('./categories');
const questionRouter = require('./question');
const paperRouter = require('./paper');
const editorRouter = require('./editor');
const authRouter = require('./auth');
const recordRouter = require('./record');
const questionsRouter = require('./questions');
examRouter
  .use(async (ctx, next) => {
    const {db} = ctx;
    const papers = await db.ExamsPaperModel.find({submitted: false, timeOut: false});
    const now = Date.now();
    await Promise.all(papers.map(async paper => {
      if(now - paper.toc >= paper.time*60*1000) {
        await paper.update({
          timeOut: true,
          tlm: Date.now(),
          passed: false
        });
      }
    }));
    await next();
  })
  .get('/', async (ctx, next) => {
    const {data, db} = ctx;
    const {user} = data;
    ctx.template = 'exam/home.pug';
    data.examsCategories = await db.ExamsCategoryModel.find({
      disabled: false
    }).sort({order: 1});
    const papers = await db.ExamsPaperModel.find({
      passed: true
    }).sort({toc: -1}).limit(20);
    data.papers = await db.ExamsPaperModel.extendPapers(papers);
    const result = await db.QuestionModel.aggregate([
      {
        $match: {
          disabled: false,
          auth: true
        }
      },
      {
        $project: {
          uid: 1
        }
      },
      {
        $group: {
          _id: '$uid',
          count: {$sum: 1}
        }
      }, {
        $sort: {
          count: -1
        }
      }
    ]);
    const usersList = [];
    for(const r of result) {
      const user = await db.UserModel.findOnly({uid: r._id});
      usersList.push({
        user,
        count: r.count
      });
    }
    data.usersList = usersList;
    data.unauthCount = await db.QuestionModel.count({
      disabled: false,
      auth: null
    });
    data.unViewedCount = await db.QuestionModel.count({uid: user.uid, viewed: false});
    await next();
  })
  .use('/record', recordRouter.routes(), recordRouter.allowedMethods())
  .use('/paper', paperRouter.routes(), paperRouter.allowedMethods())
  .use('/question', questionRouter.routes(), questionRouter.allowedMethods())
  .use('/editor', editorRouter.routes(), editorRouter.allowedMethods())
  .use('/categories', categoriesRouter.routes(), categoriesRouter.allowedMethods())
  .use('/auth', authRouter.routes(), authRouter.allowedMethods())
  .use('/questions', questionsRouter.routes(), questionsRouter.allowedMethods())
  .use('/category', categoryRouter.routes(), categoryRouter.allowedMethods());

module.exports = examRouter;