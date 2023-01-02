const videos = [
  {
    title: "good Movie",
    rate: 3,
    views: 1,
    owner: "happy man",
    id: 1,
  },
  {
    title: "Sad Movie",
    rate: 80,
    views: 13213,
    owner: "Sad man",
    id: 2,
  },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload video");
export const deleteVideo = (req, res) => res.send("delete video");
