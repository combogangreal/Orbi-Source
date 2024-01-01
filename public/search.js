document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchnav").style.backgroundColor = "#0f077d";
    document
        .getElementById("searchIcon")
        .addEventListener("click", async function (e) {
            e.preventDefault(); // Prevent the default form submission behavior
            const query = document.getElementById("search").value;
            await search(query);
        });
});
async function search(query) {
    try {
        const response = await fetch(`/api/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: query }),
        });

        const data = await response.json();

        document.getElementById("results").innerHTML = "";

        if (!data || !data.result || data.result.length === 0) {
            document.getElementById("status").innerText =
                "No results were found for that query.";
        } else {
            if (data.error) {
                document.getElementById("status").innerText = data.error;
            } else {
                document.getElementById("status").innerText = "";
                data.result.forEach((result) => {
                    const container = document.createElement("div");

                    const titleElement = document.createElement("h2");
                    titleElement.innerText = result.title;

                    const descriptionElement = document.createElement("p");
                    descriptionElement.innerText = result.description;

                    const videoElement = document.createElement("video");
                    videoElement.src = result.url;
                    videoElement.controls = true;
                    videoElement.muted = false;
                    videoElement.height = 240; // 👈️ in px
                    videoElement.width = 320; // 👈️ in px
                    videoElement.controls;

                    container.appendChild(titleElement);
                    container.appendChild(descriptionElement);
                    container.appendChild(videoElement);

                    document.getElementById("results").appendChild(container);
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("status").innerText =
            "There was an error completing your request.";
    }
}
