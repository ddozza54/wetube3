import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { username, email, password, password2, name, loacation } = req.body;

  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }

  //or operator : 각 조건이 true 일 때 실행되게 만들 수 있다.
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      username,
      email,
      password,
      password2,
      name,
      loacation,
    });
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error._message });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false }); //여기에선 social로 로그인 안한 사람만
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "User does not exits",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user; //db에서 찾은 user을 session.user에 넘겨줌.
  //위 두 줄은 세션에 정보를 추가한것임.

  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const parmas = new URLSearchParams(config).toString();
  const finalURL = `${baseUrl}?${parmas}`;
  const tokenRequest = await (
    await fetch(finalURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      res.redirect("/login");
    }
    //여기까지 왔다는건 이메일이 있다는것. 그렇다면 중복된 이멜은 어떻게 찾을 것인가!
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //craete Account
      const user = await User.create({
        name: userData.name ? userData.name : "Unknown",
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        password: "", //pw 가 없다는것 = 소셜 로그인 했다는 것
        socialOnly: true,
        loacation: userData.loacation,
      });
    }
    //이메일이 있으면 깃헙으로 로그인 했든, password 랑 같이 로그인했든 상관 안할거임.
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
