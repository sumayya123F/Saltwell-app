import "dotenv/config"; // must load before app.js reads process.env (static imports run in order)
const { app } = await import("./app.js");

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => console.log(`API proxy listening on http://localhost:${PORT}`));
