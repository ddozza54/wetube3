export const trending = (req, res) => {
    return res.render("home")};
export const see = (req, res) => {
    return res.send(`Watch Video #${req.params.id}`);};
export const edit = (req, res) => res.send("Edit Videos");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload video");
export const deleteVideo = (req, res) => res.send("delete video");
