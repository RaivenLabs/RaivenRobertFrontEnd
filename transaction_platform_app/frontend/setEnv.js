require("dotenv").config({ path: `.env.${process.env.BUILD_ENV || "production"}` });

const { exec } = require("child_process");
exec("react-scripts build", (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${stderr}`);
    process.exit(1);
  }
  console.log(stdout);
});
