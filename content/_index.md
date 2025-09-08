+++
title = "New Words"
draft = false
layout = "page"
+++

Please submit a word:

<form id="word-form">
  <p><label>New Word: <input type="text" name="word" required></label></p>
  <p><button type="submit">Submit</button></p>
</form>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("word-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const word = form.querySelector('[name="word"]').value;

    try {
      const res = await fetch(
        "https://api.github.com/repos/manh-td/new-words/actions/workflows/add-word.yml/dispatches",
        {
          method: "POST",
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": "Bearer " + window.GITHUB_TOKEN, // still injected in build step
          },
          body: JSON.stringify({
            ref: "main",
            inputs: { word: word }
          })
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error("Failed: " + JSON.stringify(err));
      }

      alert("Submitted! It will appear soon after workflow runs.");
      form.reset();
    } catch (error) {
      console.error("Error submitting word:", error);
      alert("Something went wrong.");
    }
  });
});
</script>
