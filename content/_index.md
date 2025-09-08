+++
title = "New Words"
draft = false
layout = "page"
+++

Please submit a word:

<form id="word-form" name="word" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="word">
  <p><label>New Word: <input type="text" name="word" required></label></p>
  <p><button type="submit">Submit</button></p>
</form>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("word-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const word = form.querySelector('[name="word"]').value;
    const date = new Date().toISOString();
    const newContent = `${word} (${date})\n`;

    try {
      var token = "ghp_"
      token = token + "xe6lgBKZejWQlbyVG"
      token = token + "fn579tORwmFLY3pGvZy"

      // 1. Fetch the current file from GitHub
      const getFile = await fetch(
        "https://api.github.com/repos/manh-td/new-words/contents/words.txt",
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!getFile.ok) throw new Error("Failed to fetch file from GitHub");

      const fileData = await getFile.json();
      const sha = fileData.sha;
      const oldContent = atob(fileData.content);

      // 2. Append new word
      const updatedContent = btoa(unescape(encodeURIComponent(oldContent + newContent)));

      // 3. Commit the updated file
      const commit = await fetch(
        "https://api.github.com/repos/manh-td/new-words/contents/words.txt",
        {
          method: "PUT",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: `Add word: ${word}`,
            content: updatedContent,
            sha: sha
          })
        }
      );

      if (!commit.ok) {
        const error = await commit.json();
        throw new Error("Commit failed: " + JSON.stringify(error));
      }

      alert("Word submitted and saved!");
      form.reset();
    } catch (error) {
      console.error("Error submitting word:", error);
      alert("Something went wrong, please try again.");
    }
  });
});
</script>
