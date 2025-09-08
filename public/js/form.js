document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const word = form.querySelector('[name="word"]').value;
    const date = new Date().toISOString();

    const newContent = `${word} (${date})\n`;

    try {
      // 1. Get the current file from GitHub
      const getFile = await fetch(
        "https://api.github.com/repos/manh-td/new-words/contents/words.txt",
        {
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN" // ⚠️ insecure in frontend
          }
        }
      );

      let sha = null;
      let oldContent = "";
      if (getFile.ok) {
        const fileData = await getFile.json();
        sha = fileData.sha; // needed to update existing file
        oldContent = atob(fileData.content);
      }

      // 2. Prepare updated file content
      const updatedContent = btoa(unescape(encodeURIComponent(oldContent + newContent)));

      // 3. Commit the change via GitHub API
      const commit = await fetch(
        "https://api.github.com/repos/manh-td/new-words/contents/words.txt",
        {
          method: "PUT",
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN", // ⚠️ insecure in frontend
          },
          body: JSON.stringify({
            message: `Add word: ${word}`,
            content: updatedContent,
            sha: sha
          })
        }
      );

      if (!commit.ok) {
        throw new Error("Failed to commit file");
      }

      alert("Word submitted and saved!");
      form.reset();

    } catch (error) {
      console.error("Error submitting word:", error);
      alert("Something went wrong, please try again.");
    }
  });
});
