let journals = [];

// Get the css variables to be shifted when the mouse move
const perspectiveOrigin = {
  x: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scenePerspectiveOriginX")),
  y: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scenePerspectiveOriginY")),
  maxGap: 10
};

// On load document, add the event listeners when scroll and mouse. Also create items.
document.addEventListener("DOMContentLoaded", function() {
  axios.get("https://hermes.sciocorp.org/data/database.json").then(function(response) {
      journals = response.data;
      appendJournals(journals);
      window.addEventListener("scroll", moveCamera);
      window.addEventListener("mousemove", moveCameraAngle);
      setSceneHeight();
    }).catch(function(error) {
      console.log(error);
    });
});

// Set the new perspective origins according the mouse position
function moveCameraAngle(event) {
  const xGap = (((event.clientX - window.innerWidth / 2) * 100) / (window.innerWidth / 2)) * -1;
  const yGap = (((event.clientY - window.innerHeight / 2) * 100) / (window.innerHeight / 2)) * -1;
  const newPerspectiveOriginX = perspectiveOrigin.x + (xGap * perspectiveOrigin.maxGap) / 100;
  const newPerspectiveOriginY = perspectiveOrigin.y + (yGap * perspectiveOrigin.maxGap) / 100;

  document.documentElement.style.setProperty("--scenePerspectiveOriginX", newPerspectiveOriginX);
  document.documentElement.style.setProperty("--scenePerspectiveOriginY", newPerspectiveOriginY);
}

// Set the cameraZ variable according the scroll value.
function moveCamera() {
  document.documentElement.style.setProperty("--cameraZ", window.pageYOffset);
}

// Set the viewport height according the number of elements of the database and other document variables
function setSceneHeight() {
  const numberOfItems = journals.length; // Or number of items you have in `.scene3D`
  const itemZ = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--itemZ"));
  const scenePerspective = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scenePerspective"));
  const cameraSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--camaraPerspective"));

  const height = window.innerHeight + scenePerspective * cameraSpeed + itemZ * cameraSpeed * numberOfItems;

  // Update --viewportHeight value
  document.documentElement.style.setProperty("--viewportHeight", height);
}

function createJournalItem(journal, node) {
  return `<div id=item${node} style="
                      transform: translateZ(calc(var(--itemZ) * var(--camaraPerspective) * ${node} * -1px));
                      background-color: hsl(${-30 + node * 30}, 100%, 88%);
                              ">
    <a href=${journal.url}><h2>${journal.title}</h2></a>
    <p>Año: ${journal.release_date}</p>
    <p>Autor: ${journal.author}</p>
    <p>${journal.description}</p>
    <p>Editorial: ${journal.editorial}</p>
    <p>DOI: ${journal.isbn}</p>
  </div>`;
}


// Create a journals element with all the items and put it on the scene
function appendJournals(journals) {
  const journalsEl = document.querySelector(".scene3D");
  let journalsNodes = [];
  let node = 1;

  for (journal of journals) {
    journalsNodes.push(createJournalItem(journal, node));
    node++;
  }

  journalsEl.innerHTML = journalsNodes.join(" ");
}
