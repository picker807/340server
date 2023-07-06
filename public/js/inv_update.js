const form = document.querySelector("#update-form")
    form.addEventListener("change", function () {
      console.log("Form change detected")
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })