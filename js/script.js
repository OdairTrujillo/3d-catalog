/*
NOTE: You have to copy your database.json to a server and enable CORS with
something like this in Apache:

  <Directory /var/www/host.example.com/public_html/>
            Order Allow,Deny
            Allow from all
            AllowOverride all
            Header set Access-Control-Allow-Origin "*"
  </Directory>

Also, you can disable CORS in your web browser, but consider that this is note sucure.
*/

let books = [];

// On load document add the event listeners when scroll and mouse. Also create items.
document.addEventListener("DOMContentLoaded", function() {
  axios.get("https://contrib.odair.dev/data/database.json").then(function(response) {
      books = response.data;
      appendBooks(books);
      window.addEventListener("scroll", moveCamera);
      setSceneHeight();
    }).catch(function(error) {
      console.log(error);
    });
});

// Set the --cameraZ variable according the page scroll value.
function moveCamera() {
  document.documentElement.style.setProperty("--cameraZ", window.pageYOffset);
}

// Set the viewport height according the number of elements of the database and other document variables
function setSceneHeight() {
  const numberOfItems = books.length; // Or number of items you have in `.itemsContainer3D`
  const itemSpacing = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--itemSpacing"));
  const scenePerspective = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scenePerspective"));

  const height = window.innerHeight + scenePerspective + itemSpacing * scenePerspective * numberOfItems;

  // Update --viewportHeight value
  document.documentElement.style.setProperty("--viewportHeight", height);
}
/*
NOTE: The node variable could be used to position the item into the timeline, you could use also the
year of the item and make some calculations in order to position the item exactly where it belongs.
*/
function createBookItem(book, node) {
  return `<div id=item${node} style="
                      transform: translateZ(calc(var(--itemSpacing) * var(--scenePerspective) * ${node} * -1px));
                      background-color: hsl(${-30 + node * 30}, 100%, 88%);
                              ">
    <a href=${book.url}><h2>${book.title}</h2></a>
    <p>Año: ${book.release_date}</p>
    <p>Autor: ${book.author}</p>
    <p>${book.description}</p>
    <p>Editorial: ${book.editorial}</p>
    <p>DOI: ${book.isbn}</p>
  </div>`;
}


// Create a journals element with all the items and put it on the scene
function appendBooks(books) {
  const booksEl = document.querySelector(".itemsContainer3D");
  let booksNodes = [];
  let node = 1;
  for (book of books) {
    booksNodes.push(createBookItem(book, node));
    node++;
  }
  booksEl.innerHTML = booksNodes.join(" ");
}
