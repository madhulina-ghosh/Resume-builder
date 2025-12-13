let feilds = ['name', 'phone', 'email', 'address','social-links', 'objective', 'education', 'interests', 'languages'];

feilds.forEach(id =>{
   let input = document.getElementById(id);
   let preview = document.getElementById('preview-' + id);

   if(!input || !preview) return;

   let fallback = preview.innerText;

   input.addEventListener('input', e =>{
      preview.innerText = e.target.value.trim() || fallback;
   });
});

let photoInput = document.getElementById('photo');
let photoDiv = document.getElementById('preview-photo');

photoInput.addEventListener('change', e =>{
   let file = e.target.files[0];

   if(file){
      let reader = new FileReader();
      reader.onload = () =>{

         /* ✅ FIXED */
         photoDiv.style.background = `center/cover no-repeat url(${reader.result})`;
         photoDiv.style.setProperty('--content', "''");

      };
      reader.readAsDataURL(file);
   }else{
      /* ✅ FIXED */
      photoDiv.style.background = '';
      photoDiv.style.setProperty('--content', "your profile");
   }
});

function setupListManager(inputId, btnId, listId, previewId, max = 5) {

  let input = document.getElementById(inputId),
        addBtn = document.getElementById(btnId),
        list = document.getElementById(listId),
        preview = document.getElementById(previewId);

  let updatePreview = () => {
    preview.innerHTML = "";
    [...list.querySelectorAll("span")].forEach(span => {
      let li = document.createElement("li");
      li.textContent = span.textContent;
      preview.appendChild(li);
    });
  };

  let createItem = (text) => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.textContent = text;

    let createBtn = (icon, cb) => {
      let btn = document.createElement("button");
      btn.innerHTML = icon;
      btn.onclick = cb;
      return btn;
    };

    let editBtn = createBtn('<i class="fas fa-edit"></i>', () => {
      let box = li.querySelector("input");
      if (!box) {
        box = document.createElement("input");
        box.type = "text";
        box.value = span.textContent;
        box.maxLength = 40;
        li.insertBefore(box, span);
        span.style.display = "none";
        editBtn.innerHTML = '<i class="fas fa-check"></i>';
        box.focus();

        box.addEventListener("keydown", e => {
          if (e.key === "Enter") {
            e.preventDefault();
            editBtn.click();
          }
        });
      } else {
        if (box.value.trim()) span.textContent = box.value.trim();
        box.remove();
        span.style.display = "inline";
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        updatePreview();
      }
    });

    let delBtn = createBtn('<i class="fas fa-trash"></i>', () => {
      li.remove();
      updatePreview();
    });

    li.append(span, editBtn, delBtn);
    return li;
  };

   addBtn.addEventListener('click', () =>{
      let val = input.value.trim();
      if(!val || list.children.length >= max) return;
      list.appendChild(createItem(val));
      updatePreview();
      input.value = '';
   });

   input.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
         e.preventDefault();
         addBtn.click();
      }
   });
};

setupListManager('skill-input', 'add-skill', 'skill-list', 'preview-skills');
setupListManager('project-input', 'add-project', 'project-list', 'preview-projects');

document.querySelector('#downloadPdf').addEventListener('click', () => {

   let resume = document.getElementById('resume');

   html2pdf().set({
      filename : 'resume.pdf',
      image : {type : 'jpeg', quality : .95},
      html2canvas : {scale : 3, useCORS : true, backgroundColor : '#fff'},
      jsPDF : {unit : 'in', format : 'a4', orientation : 'portrait'}, // ✅ FIXED
      pagebreak : {mode : ['css', 'legacy']},
   }).from(resume).save();

});