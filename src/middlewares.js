export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  // req.session.loggedIn 얘는 postLoggedIn 에서 로그인 통과하면 보내줌.
  // 이제 전체 페이지에서 로그인 했는지 여부를 알 수 있음.
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};
