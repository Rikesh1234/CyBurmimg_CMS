const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
const stickyButtons = document.querySelector(".button-box");

if (window.innerWidth > 1024) {
  window.addEventListener("scroll", () => {
    if (stickyButtons != null) {
      if (window.scrollY > 750) {
        stickyButtons.style.display = "flex";
        stickyButtons.style.visibility = "visible";
      } else {
        stickyButtons.style.display = "none";
        stickyButtons.style.visibility = "hidden";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const notifiButton = document.querySelector(".notification");
  const notifiDiv = document.querySelector(".notification_dd");
  const show_all = document.querySelector(".show_all");
  const notifiPopup = document.querySelector(".popup");
  const notiClose = document.querySelector(".noti-close");

  notifiButton.addEventListener("click", (event) => {
    notifiDiv.classList.toggle("notify-active");
  });

  show_all.addEventListener("click", (event) => {
    notifiPopup.style.display = "block";
  });

  notiClose.addEventListener("click", () => {
    notifiPopup.style.display = "none";
  });

  const uploadInput = document.getElementById("upload-input");
  const imageContainer = document.getElementById("image-container");
  let images = [];

  if (uploadInput !== null) {
    uploadInput.addEventListener("change", function (event) {
      const files = event.target.files;
      if (files) {
        for (const file of files) {
          const imageCard = document.createElement("div");
          imageCard.classList.add("upload-card");
          const reader = new FileReader();
          reader.onload = function () {
            const img = document.createElement("img");
            img.src = reader.result;
            img.classList.add("uploaded-image");
            imageCard.appendChild(img);
            const captionInput = document.createElement("input");
            captionInput.type = "text";
            captionInput.placeholder = "Enter image caption...";
            captionInput.classList.add("form-control");
            imageCard.appendChild(captionInput);
            const removeButton = document.createElement("button");
            removeButton.textContent = "X";
            removeButton.classList.add("remove-button");
            removeButton.addEventListener("click", function (e) {
              e.stopPropagation(); // Prevents the click event from propagating to the parent elements
              imageContainer.removeChild(imageCard);
              images = images.filter((image) => image.file !== file);
            });
            imageCard.appendChild(removeButton);
            imageContainer.appendChild(imageCard);
            images.push({ file: file, caption: captionInput });
          };
          reader.readAsDataURL(file);
        }
      }
    });
  }

  // Example of accessing the uploaded images array:
  images.forEach((image) => {
    console.log(image.file); // Access the file object
    console.log(image.caption.value); // Access the caption value
  });

  const uploadInputOne = document.getElementById("upload-input-one");
  const imageContainerOne = document.getElementById("image-container-one");
  let uploadedImage = document.querySelector(".uploaded-image");
  let deleteButtons;

  if (uploadInputOne !== null) {
    uploadInputOne.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          if (uploadedImage) {
            imageContainerOne.removeChild(uploadedImage);
          }
          const img = document.createElement("img");
          img.src = reader.result;
          img.classList.add("uploaded-image");
          imageContainerOne.appendChild(img);
          uploadedImage = img;
        };
        reader.readAsDataURL(file);
      }
    });
  }


  const customUploadInputOne = document.getElementById("custom-upload-input-one");
  const customImageContainerOne = document.getElementById("custom-image-container-one");
  let customUploadedImage = document.querySelector(".custom-uploaded-image");

  if (customUploadInputOne !== null) {
    customUploadInputOne.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          if (customUploadedImage) {
            customImageContainerOne.removeChild(customUploadedImage);
          }
          const img = document.createElement("img");
          img.src = reader.result;
          img.classList.add("uploaded-image");
          customImageContainerOne.appendChild(img);
          customUploadedImage = img;
        };
        reader.readAsDataURL(file);
      }
    });
  }


  const colorRepeator = document.querySelector("#ColorRepetor");

  if (colorRepeator !== null) {
    colorRepeator.addEventListener("click", (event) => {
      event.preventDefault();
      const container = document.querySelector(".color-container");

      const newElement = document.createElement("div");
      newElement.className = "color-upload-contains";
      newElement.innerHTML = `
          <div class="column">
              <div class="row">
                  <div class="main">
                      <label class="form-label color-product">
                          Color Picker:
                          <input type="color" class="color-picker" value="#ffffff" />
                      </label>
                      <label class="form-label color-product">
                          Hex Code:
                          <input type="text" class="hex-code" name="hex_code" value="#ffffff" style="width: 55%;" />
                      </label>
                  </div>
              </div>
          </div>
          <div class="upload-container" style="width:100%;">
              <input class="upload-input-color-product" type="file" accept="image/*" multiple style="display: none" />
              <label class="upload-label" for="upload-input-color-product">Upload Image</label>
          </div>
          <div class="delete-btn"><i class="fa-solid fa-minus"></i></div>
      `;

      //     // Append the new element to the container
      container.appendChild(newElement);

      const deleteButton = newElement.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () => {
        newElement.remove();
      });

      const uploadLabel = newElement.querySelector(".upload-label");
      const uploadInput = newElement.querySelector(
        ".upload-input-color-product"
      );

      //     // Show file input when label is clicked
      uploadLabel.addEventListener("click", () => {
        uploadInput.click();
      });

      //     // Handle file selection
      uploadInput.addEventListener("change", function (event) {
        const files = event.target.files;
        const imageContainer = newElement.querySelector(".upload-container");

        // Clear previous content in the image container
        imageContainer.innerHTML = "";

        // Display selected images
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();

          reader.onload = function () {
            const img = document.createElement("img");
            img.src = reader.result;
            img.classList.add("uploaded-image");

            // Append the new image to the image container
            imageContainer.appendChild(img);
          };

          reader.readAsDataURL(file);
        }
      });
    });
  }

  let itenaryRepetor = document.querySelector("#itenary-btn");

  if (itenaryRepetor !== null) {
    itenaryRepetor.addEventListener("click", (event) => {
      event.preventDefault();
      const container = document.querySelector(".itenary-container");

      const newElement = document.createElement("div");
      newElement.className = "color-upload-contains";
      newElement.innerHTML = `
		<div class="title-itenary">
                  <div class="form-label color-product">
                    <label for="Title" style="
                            background-color: transparent;
                            color: #000;
                            text-align: left;
                            width: inherit;
                          ">Title</label><span class="important">*</span>
                  </div>
                  <input type="text" name="itenary_title" class="form-control">
                  </div>
                  <div class="description-itenary">
                    <div class="form-label color-product">
                      <label for="description_itenary" style="
                            background-color: transparent;
                            color: #000;
                            text-align: left;
                            width: inherit;
                          ">Description</label>
                    </div>
                    <textarea
                      type="text"
                      class="form-control"
                      name="description_itenary"
                      rows="7"
                      cols="35"
                      id="description_itenary"
                    ></textarea>
                  </div>
		<div class="delete-btn" id="delete-btn" style="height:61px;"><i class="fa-solid fa-minus"></i></div>
	`;

      //   // Append the new element to the container
      container.appendChild(newElement);

      deleteButtons = document.querySelectorAll(".delete-btn");

      deleteButtons.forEach((currentValue, index, array) => {
        currentValue.addEventListener("click", () => {
          currentValue.parentElement.remove();
        });
      });
    });
  }

  let includesRepetor = document.querySelector("#includes-btn");

  if (includesRepetor !== null) {
    includesRepetor.addEventListener("click", (event) => {
      event.preventDefault();
      const container = document.querySelector(".include-container");

      const newElement = document.createElement("div");
      newElement.className = "color-upload-contains";
      newElement.innerHTML = `
		<div class="description-itenary">
                  <div class="form-label color-product">
                    <label for="description_itenary" style="
                          background-color: transparent;
                          color: #000;
                          text-align: left;
                          width: inherit;
                        ">Description</label>
                  </div>
                  <textarea
                    type="text"
                    class="form-control"
                    name="description_include"
                    rows="7"
                    cols="72"
                    id="description_include"
                  ></textarea>
                </div>
  <div class="delete-btn" id="delete-btn" style="height:61px;"><i class="fa-solid fa-minus"></i></div>
</div>
	`;

      //     // Append the new element to the container
      container.appendChild(newElement);

      deleteButtons = document.querySelectorAll(".delete-btn");

      deleteButtons.forEach((currentValue, index, array) => {
        currentValue.addEventListener("click", () => {
          currentValue.parentElement.remove();
        });
      });
    });
  }

  let excludesRepetor = document.querySelector("#excludes-btn");

  if (excludesRepetor !== null) {
    excludesRepetor.addEventListener("click", (event) => {
      event.preventDefault();
      const container = document.querySelector(".exclude-container");

      const newElement = document.createElement("div");
      newElement.className = "color-upload-contains";
      newElement.innerHTML = `
		<div class="description-itenary">
                  <div class="form-label color-product">
                    <label for="description_itenary" style="
                          background-color: transparent;
                          color: #000;
                          text-align: left;
                          width: inherit;
                        ">Description</label>
                  </div>
                  <textarea
                    type="text"
                    class="form-control"
                    name="description_exclude"
                    rows="7"
                    cols="72"
                    id="description_exclude"
                  ></textarea>
                </div>
  <div class="delete-btn" id="delete-btn" style="height:61px;"><i class="fa-solid fa-minus"></i></div>
</div>
	`;

      //     // Append the new element to the container
      container.appendChild(newElement);

      deleteButtons = document.querySelectorAll(".delete-btn");

      deleteButtons.forEach((currentValue, index, array) => {
        currentValue.addEventListener("click", () => {
          currentValue.parentElement.remove();
        });
      });
    });
  }

  let colorUploadInput = document.querySelectorAll("#upload-input-color");
  let colorImageContainer = document.querySelectorAll("#image-container-color");
  let colorUploadedImage = document.querySelectorAll(".color-uploaded-image");

  if (uploadInputOne !== null) {
    uploadInputOne.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          if (uploadedImage) {
            imageContainerOne.removeChild(uploadedImage);
          }
          const img = document.createElement("img");
          img.src = reader.result;
          img.classList.add("uploaded-image");
          imageContainerOne.appendChild(img);
          uploadedImage = img;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

const sidebar = document.querySelector(".mobile-sidebar");
const sidebarClose = document.querySelector("#sidebar-close");
const menu = document.querySelector(".menu-content");
const menuItems = document.querySelectorAll(".submenu-item");
const subMenuTitles = document.querySelectorAll(".submenu .menu-title");

sidebarClose.addEventListener("click", () => (sidebar.style.left = "-800px"));
menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    menu.classList.add("submenu-active");
    item.classList.add("show-submenu");
    menuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show-submenu");
      }
    });
  });
});
subMenuTitles.forEach((title) => {
  title.addEventListener("click", () => {
    menu.classList.remove("submenu-active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebared = document.getElementById("sidebar");

var screenWidth = window.innerWidth;
// Check screen height
var screenHeight = window.innerHeight;

if (screenWidth > 1500) {
  if (menuBar !== null) {
    menuBar.addEventListener("click", function () {
      sidebared.classList.toggle("hide");
    });
  }
} else {
  if (menuBar !== null) {
    menuBar.addEventListener("click", function () {
      sidebar.style.left = "0px";
    });
  }
}

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

if (searchButton !== null) {
  searchButton.addEventListener("click", function (e) {
    if (window.innerWidth < 576) {
      e.preventDefault();
      searchForm.classList.toggle("show");
      if (searchForm.classList.contains("show")) {
        searchButtonIcon.classList.replace("bx-search", "bx-x");
      } else {
        searchButtonIcon.classList.replace("bx-x", "bx-search");
      }
    }
  });
}

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  if (searchButtonIcon !== null && searchForm !== null) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // TOGGLE SIDEBAR
  const menuBar = document.querySelector("#content nav .bx.bx-menu");
  const sidebared = document.getElementById("sidebar");
  const content = document.querySelector("#content");
  const parent = content.parentElement;
  const brandLogo = document.querySelector(".brand-logo");
  var menuFlag = 1;

  if (screenWidth > 1500) {
    if (menuBar !== null) {
      menuBar.addEventListener("click", function () {

        sidebar.classList.toggle("hide");
      });
    }
  } else {
    if (menuBar !== null) {
      menuBar.addEventListener("click", function () {
        if (menuFlag == 1) {
          sidebar.style.left="0"
          sidebared.style.width = "54px";
          content.style.left = "54px";
          const parentWidth = parent.offsetWidth;
          const newWidth = parentWidth - 52 + "px";
          content.style.width = newWidth;
          brandLogo.style.height = 71 + "px"; 
          menuFlag = 0;
        } else {
          sidebared.style.width = "280px";
          content.style.left = "280px";
          const parentWidth = parent.offsetWidth;
          const newWidth = parentWidth - 284 + "px";
          content.style.width = newWidth;
          brandLogo.style.height = 80 + "px"; 
          menuFlag = 1;
        }
      });
    }
  }

  if (window.screenWidth > 800) {
    const dropdowns = document.querySelectorAll(".dropdown");
    let clickcount = 0;
    let dropdownmenuHeight;

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", function () {
        dropdown.classList.toggle("active");
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        clickcount = checkForOpenMenu(dropdownmenuHeight, dropdown);
       
        dropdownMenu.classList.toggle("show");
        dropdownMenu.style.top = dropdown.clientHeight + "px";
        if (clickcount <= 0) {
          dropdownmenuHeight = dropdownMenu.clientHeight;
          dropdown.querySelector("a").style.height =
            dropdown.clientHeight - 10 + "px";
          dropdown.style.height =
            dropdownMenu.clientHeight + dropdown.clientHeight + "px";
          clickcount = 1;
        } else {
          dropdown.style.height =
            dropdown.clientHeight - dropdownmenuHeight + "px";
          clickcount = 0;
        }
      });
    });

    checkForOpenMenu = (dropdownmenuHeight, clickMenu) => {
      let flag = 0;
      dropdowns.forEach((dropdown) => {
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        if (dropdownMenu.classList.contains("show")) {
          if (clickMenu != dropdown) {
            dropdownMenu.classList.remove("show");
            dropdown.style.height =
              dropdown.clientHeight - dropdownmenuHeight + "px";
            flag = 0;
          } else {
            flag = 1;
          }
        }
      });
      return flag;
    };

    // window.addEventListener("click", function (e) {
    //   dropdowns.forEach((dropdown) => {
    //     // clickcount = 0;
    //     if (!dropdown.contains(e.target)) {
    //       dropdown.classList.remove("active");
    //       const dropdownMenu = dropdown.querySelector(".dropdown-menu");
    //       dropdownMenu.classList.remove("show");
    //       dropdown.style.height =
    //         dropdown.clientHeight - dropdownMenu.clientHeight + "px";
    //     }
    //   });
    // });
  }
});

var util = {
    f: {
      addStyle: function (elem, prop, val, vendors) {
        var i, ii, property, value;
        if (!util.f.isElem(elem)) {
          elem = document.getElementById(elem);
        }
        if (!util.f.isArray(prop)) {
          prop = [prop];
          val = [val];
        }
        for (i = 0; i < prop.length; i += 1) {
          var thisProp = String(prop[i]),
            thisVal = String(val[i]);
          if (typeof vendors !== "undefined") {
            if (!util.f.isArray(vendors)) {
              vendors.toLowerCase() == "all"
                ? (vendors = ["webkit", "moz", "ms", "o"])
                : (vendors = [vendors]);
            }
            for (ii = 0; ii < vendors.length; ii += 1) {
              elem.style[vendors[i] + thisProp] = thisVal;
            }
          }
          thisProp = thisProp.charAt(0).toLowerCase() + thisProp.slice(1);
          elem.style[thisProp] = thisVal;
        }
      },
      cssLoaded: function (event) {
        var child = util.f.getTrg(event);
        child.setAttribute("media", "all");
      },
      events: {
        cancel: function (event) {
          util.f.events.prevent(event);
          util.f.events.stop(event);
        },
        prevent: function (event) {
          event = event || window.event;
          event.preventDefault();
        },
        stop: function (event) {
          event = event || window.event;
          event.stopPropagation();
        },
      },
      getSize: function (elem, prop) {
        return parseInt(elem.getBoundingClientRect()[prop], 10);
      },
      getTrg: function (event) {
        event = event || window.event;
        if (event.srcElement) {
          return event.srcElement;
        } else {
          return event.target;
        }
      },
      isElem: function (elem) {
        return util.f.isNode(elem) && elem.nodeType == 1;
      },
      isArray: function (v) {
        return v.constructor === Array;
      },
      isNode: function (elem) {
        return typeof Node === "object"
          ? elem instanceof Node
          : elem &&
              typeof elem === "object" &&
              typeof elem.nodeType === "number" &&
              typeof elem.nodeName === "string" &&
              elem.nodeType !== 3;
      },
      isObj: function (v) {
        return typeof v == "object";
      },
      replaceAt: function (str, index, char) {
        return str.substr(0, index) + char + str.substr(index + char.length);
      },
    },
  },
  //////////////////////////////////////
  // ok that's all the utilities      //
  // onto the select box / form stuff //
  //////////////////////////////////////
  form = {
    f: {
      init: {
        register: function () {
          var child,
            children = document.getElementsByClassName("field"),
            i;
          for (i = 0; i < children.length; i += 1) {
            child = children[i];
            util.f.addStyle(child, "Opacity", 1);
          }
          children = document.getElementsByClassName("psuedo_select");
          for (i = 0; i < children.length; i += 1) {
            child = children[i];
            child.addEventListener("click", form.f.select.toggle);
          }
        },
        unregister: function () {
          //just here as a formallity
          //call this to stop all ongoing timeouts are ready the page for some sort of json re-route
        },
      },
      select: {
        blur: function (field) {
          field.classList.remove("focused");
          var child,
            children = field.childNodes,
            i,
            ii,
            nested_child,
            nested_children;
          for (i = 0; i < children.length; i += 1) {
            child = children[i];
            if (util.f.isElem(child)) {
              if (child.classList.contains("deselect")) {
                child.parentNode.removeChild(child);
              } else if (child.tagName == "SPAN") {
                if (!field.dataset.value) {
                  util.f.addStyle(child, ["FontSize", "Top"], ["16px", "32px"]);
                }
              } else if (child.classList.contains("psuedo_select")) {
                nested_children = child.childNodes;
                for (ii = 0; ii < nested_children.length; ii += 1) {
                  nested_child = nested_children[ii];
                  if (util.f.isElem(nested_child)) {
                    if (nested_child.tagName == "SPAN") {
                      if (!field.dataset.value) {
                        util.f.addStyle(
                          nested_child,
                          ["Opacity", "Transform"],
                          [0, "translateY(24px)"]
                        );
                      }
                    } else if (nested_child.tagName == "UL") {
                      util.f.addStyle(
                        nested_child,
                        ["Height", "Opacity"],
                        [0, 0]
                      );
                    }
                  }
                }
              }
            }
          }
        },
        focus: function (field) {
          field.classList.add("focused");
          var bool = false,
            child,
            children = field.childNodes,
            i,
            ii,
            iii,
            nested_child,
            nested_children,
            nested_nested_child,
            nested_nested_children,
            size = 0;
          for (i = 0; i < children.length; i += 1) {
            child = children[i];
            util.f.isElem(child) && child.classList.contains("deselect")
              ? (bool = true)
              : null;
          }
          if (!bool) {
            child = document.createElement("div");
            child.className = "deselect";
            child.addEventListener("click", form.f.select.toggle);
            field.insertBefore(child, children[0]);
          }
          for (i = 0; i < children.length; i += 1) {
            child = children[i];
            if (
              util.f.isElem(child) &&
              child.classList.contains("psuedo_select")
            ) {
              nested_children = child.childNodes;
              for (ii = 0; ii < nested_children.length; ii += 1) {
                nested_child = nested_children[ii];
                if (
                  util.f.isElem(nested_child) &&
                  nested_child.tagName == "UL"
                ) {
                  size = 0;
                  nested_nested_children = nested_child.childNodes;
                  for (iii = 0; iii < nested_nested_children.length; iii += 1) {
                    nested_nested_child = nested_nested_children[iii];
                    if (
                      util.f.isElem(nested_nested_child) &&
                      nested_nested_child.tagName == "LI"
                    ) {
                      size += util.f.getSize(nested_nested_child, "height");
                      console.log("size: " + size);
                    }
                  }
                  util.f.addStyle(
                    nested_child,
                    ["Height", "Opacity"],
                    [size + "px", 1]
                  );
                }
              }
            }
          }
        },
        selection: function (child, parent) {
          var children = parent.childNodes,
            i,
            ii,
            nested_child,
            nested_children,
            time = 0,
            value;
          if (util.f.isElem(child) && util.f.isElem(parent)) {
            parent.dataset.value = child.dataset.value;
            value = child.innerHTML;
          }
          for (i = 0; i < children.length; i += 1) {
            child = children[i];
            if (util.f.isElem(child)) {
              if (child.classList.contains("psuedo_select")) {
                nested_children = child.childNodes;
                for (ii = 0; ii < nested_children.length; ii += 1) {
                  nested_child = nested_children[ii];
                  if (
                    util.f.isElem(nested_child) &&
                    nested_child.classList.contains("selected")
                  ) {
                    if (nested_child.innerHTML) {
                      time = 1e2;
                      util.f.addStyle(
                        nested_child,
                        ["Opacity", "Transform"],
                        [0, "translateY(24px)"],
                        "all"
                      );
                    }
                    setTimeout(
                      function (c, v) {
                        c.innerHTML = v;
                        util.f.addStyle(
                          c,
                          ["Opacity", "Transform", "TransitionDuration"],
                          [1, "translateY(0px)", ".1s"],
                          "all"
                        );
                      },
                      time,
                      nested_child,
                      value
                    );
                  }
                }
              } else if (child.tagName == "SPAN") {
                util.f.addStyle(
                  child,
                  ["FontSize", "Top", "Left"],
                  ["12px", "14px", "5px"]
                );
              }
            }
          }
        },
        toggle: function (event) {
          util.f.events.stop(event);
          var child = util.f.getTrg(event),
            children,
            i,
            parent;
          switch (true) {
            case child.classList.contains("psuedo_select"):
            case child.classList.contains("deselect"):
              parent = child.parentNode;
              break;
            case child.classList.contains("options"):
              parent = child.parentNode.parentNode;
              break;
            case child.classList.contains("option"):
              parent = child.parentNode.parentNode.parentNode;
              form.f.select.selection(child, parent);
              break;
          }
          parent.classList.contains("focused")
            ? form.f.select.blur(parent)
            : form.f.select.focus(parent);
        },
      },
    },
  };

function selectColor() {
  var selectedColor = document.getElementById("colorPicker").value;
  document.getElementById("hexCode").value = selectedColor;
}
// document.getElementById("colorPicker").addEventListener("input", selectColor);

window.onload = form.f.init.register;
