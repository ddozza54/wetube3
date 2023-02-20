import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    //secret 은 쿠키에 sign 할 때 사용하는 string.
    //쿠키에 sign 하는 이유: 우리의 backend가 쿠키를 줬다는걸 보여주기 위함임.
    //잘 보호해야함. 왜냐면 session hijack : 세션 훔쳐서 나 인 척 할 수 있기 때문
    resave: false,
    saveUninitialized: false,
    // resave와 saveUninitialized 항목이 true 일 방문자의 session을 모두 db 에 저장, 쿠키를 준다.
    //하지만 익명의 이용자에겐 그럴 필요없으니 false 로 바꿈
    //새로운 세션이 수정될 때만 쿠키를 주겠다
    //유일하게 수정되는 곳: Login controller => 즉, 로그인 할 때만 쿠키를 주겠다!

    //  cookie:{
    //   maxAge:20000,
    //  }// 쿠키 만료 기간을 정하고 싶을 때 쓰면 됨.

    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
